import uuid

from providers.tts_provider import (
    generate_speech
)

def text_to_speech(text):

    file_name = f"{uuid.uuid4()}.mp3"

    output_path = f"temp/{file_name}"

    generate_speech(
        text,
        output_path
    )

    return output_path