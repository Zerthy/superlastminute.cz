import os
import re
from bs4 import BeautifulSoup
from glob import glob

# Získání absolutní cesty k souboru
dir_path = os.path.dirname(os.path.realpath(__file__))
strongs_file = os.path.join(dir_path, "JednoSlovoStrong.txt")

# Načtení souboru a vytvoření slovníku
with open(strongs_file, "r", encoding="utf8") as f:
    content = f.read()

strongs = re.findall(r"<strong>(.*?)</strong>", content, re.DOTALL)
strongs_dict = {word.lower(): word for word in strongs}


# Definice funkce pro nahrazení silných slov
def replace_with_strong(match):
    word = match.group()
    strong_word = strongs_dict.get(word.lower())
    return f"<strong>{strong_word}</strong>" if strong_word else word


# Projít všechny .html soubory v rodičovské složce a podsložkách
for file_name in glob(os.path.join("..", "**/*.html"), recursive=True):
    with open(file_name, "r", encoding="utf8") as f:
        file_content = f.read()

    # Použití BeautifulSoup pro zpracování HTML
    soup = BeautifulSoup(file_content, "html.parser")

    # Projít všechny textové uzly a nahradit silná slova uvnitř značek <strong></strong>
    text_nodes = soup.find_all(string=True)
    for text_node in text_nodes:
        # Kontrola, zda je textový uzel již uvnitř <strong> tagu
        if (
            text_node.parent.name != "strong"
            and text_node.find_parent("a") is None
            and text_node.find_parent("strong") is None
        ):
            replaced_text = re.sub(
                r"\b(" + "|".join(map(re.escape, strongs_dict.keys())) + r")\b",
                replace_with_strong,
                text_node,
                flags=re.IGNORECASE,
            )
            if replaced_text != text_node:
                new_content = BeautifulSoup(replaced_text, "html.parser")
                text_node.replace_with(new_content)
                text_nodes = new_content.find_all(string=True) + text_nodes

    # Uložit změny do souboru
    with open(file_name, "w", encoding="utf8") as f:
        f.write(str(soup))
