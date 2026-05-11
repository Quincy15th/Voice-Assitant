from flask import Blueprint
from flask import request
from flask import jsonify

from services.stt_service import (
    speech_to_text
)

stt_bp = Blueprint(
    "stt",
    __name__,
    url_prefix="/stt"
)

@stt_bp.route(
    "/transcribe",
    methods=["POST"]
)
def transcribe():

    if "audio" not in request.files:

        return jsonify({
            "success": False,
            "message": "Audio file is required"
        }), 400

    audio = request.files["audio"]

    text = speech_to_text(audio)

    return jsonify({
        "success": True,
        "text": text
    })