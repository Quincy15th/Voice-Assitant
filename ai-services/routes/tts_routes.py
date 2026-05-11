import os

from flask import Blueprint
from flask import request
from flask import jsonify
from flask import send_file

from services.tts_service import (
    text_to_speech
)

tts_bp = Blueprint(
    "tts",
    __name__,
    url_prefix="/tts"
)

@tts_bp.route(
    "/speak",
    methods=["POST"]
)
def speak():

    data = request.get_json()

    text = data.get("text")

    if not text:

        return jsonify({
            "success": False,
            "message": "Text is required"
        }), 400

    audio_path = text_to_speech(text)

    response = send_file(
        audio_path,
        mimetype="audio/mpeg"
    )

    @response.call_on_close
    def cleanup():

        if os.path.exists(audio_path):
            os.remove(audio_path)

    return response