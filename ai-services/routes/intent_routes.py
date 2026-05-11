from flask import Blueprint
from flask import request
from flask import jsonify

from services.intent_service import (
    classify_intent
)

intent_bp = Blueprint(
    "intent",
    __name__,
    url_prefix="/intent"
)

@intent_bp.route(
    "/predict",
    methods=["POST"]
)
def predict():

    data = request.get_json()

    text = data.get("text")

    if not text:

        return jsonify({
            "success": False,
            "message": "Text is required"
        }), 400

    intent = classify_intent(text)

    return jsonify({
        "success": True,
        "intent": intent
    })