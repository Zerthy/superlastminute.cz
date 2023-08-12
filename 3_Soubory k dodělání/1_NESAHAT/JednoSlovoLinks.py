import os
import re
from bs4 import BeautifulSoup, NavigableString

# Získejte cestu k adresáři, ve kterém je tento skript umístěný
script_dir = os.path.dirname(os.path.realpath(__file__))

# Sestavte cestu k souboru "JednoSlovoLinks.txt"
file_path = os.path.join(script_dir, "JednoSlovoLinks.txt")

# Načtení souboru a vytvoření slovníku
with open(file_path, "r", encoding="utf8") as f:
    content = f.read()

links = re.findall(r'<a href="(.*?)">(.*?)</a>', content, re.DOTALL)
links_dict = {word.lower(): url for url, word in links}


# Definice funkce pro nahrazení slov odkazy
def replace_with_link(match):
    word = match.group()
    url = links_dict.get(word.lower())
    return f'<a href="{url}">{word}</a>' if url else word


# Projít všechny .html soubory a podsložky v mateřském adresáři
for dirpath, dirnames, filenames in os.walk(".."):
    for filename in filenames:
        if filename.endswith(".html"):
            file_path = os.path.join(dirpath, filename)
            with open(file_path, "r", encoding="utf8") as f:
                file_content = f.read()

            # Použití BeautifulSoup pro zpracování HTML
            soup = BeautifulSoup(file_content, "html.parser")

            # Projít všechny textové uzly, které nejsou součástí odkazu, a nahradit slova odkazy
            text_nodes = soup.find_all(string=True)
            while text_nodes:
                text_node = text_nodes.pop(0)
                parent = text_node.parent
                if parent.name != "a":  # ignorovat text, který je již součástí odkazu
                    replaced_text = re.sub(
                        r"\b(" + "|".join(links_dict.keys()) + r")\b",
                        replace_with_link,
                        text_node,
                        flags=re.IGNORECASE,
                    )
                    if replaced_text != text_node:
                        new_content = BeautifulSoup(replaced_text, "html.parser")
                        text_node.replace_with(new_content)
                        text_nodes = new_content.find_all(string=True) + text_nodes

            # Uložit změny do souboru
            with open(file_path, "w", encoding="utf8") as f:
                f.write(str(soup))
