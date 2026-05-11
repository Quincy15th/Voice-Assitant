import os
import uuid

from providers.whisper_provider import transcribe_audio


def speech_to_text(audio_file):

    # tạo folder temp nếu chưa có
    os.makedirs("temp", exist_ok=True)

    extension = audio_file.filename.split(".")[-1]

    file_name = f"{uuid.uuid4()}.{extension}"

    temp_path = os.path.join(
        "temp",
        file_name
    )

    audio_file.save(temp_path)

    try:

        text = transcribe_audio(temp_path)
        print(text)
        return text

    finally:

        if os.path.exists(temp_path):
            os.remove(temp_path)