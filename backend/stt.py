import sys
import json
import os
import traceback
import shutil

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

ffmpeg_dir = r"C:\Users\saoma\AppData\Local\Microsoft\WinGet\Links"
os.environ["PATH"] += os.pathsep + ffmpeg_dir

try:
    import whisper
except Exception as e:
    print(json.dumps({
        "success": False,
        "error": f"Import whisper failed: {str(e)}"
    }, ensure_ascii=True))
    sys.exit(1)

model = whisper.load_model("base")

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "Missing audio file path"
        }, ensure_ascii=True))
        sys.exit(1)

    audio_path = sys.argv[1]

    if not os.path.exists(audio_path):
        print(json.dumps({
            "success": False,
            "error": f"File not found: {audio_path}"
        }, ensure_ascii=True))
        sys.exit(1)

    try:
        ffmpeg_path = shutil.which("ffmpeg")
        if not ffmpeg_path:
            print(json.dumps({
                "success": False,
                "error": "ffmpeg not found in PATH"
            }, ensure_ascii=True))
            sys.exit(1)

        result = model.transcribe(audio_path, language="vi")

        print(json.dumps({
            "success": True,
            "text": result.get("text", "").strip(),
            "language": result.get("language", "unknown"),
            "ffmpeg": ffmpeg_path
        }, ensure_ascii=True))

    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc(),
            "ffmpeg": shutil.which("ffmpeg")
        }, ensure_ascii=True))
        sys.exit(1)

if __name__ == "__main__":
    main()