from deep_translator import GoogleTranslator


def translate_text(text, source, target):
    translated = GoogleTranslator(
        source=source,
        target=target
    ).translate(text)

    return translated