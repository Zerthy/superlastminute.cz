import os
import sys
import codecs
from bs4 import BeautifulSoup

# Získání absolutní cesty k složce se skriptem
dir_path = os.path.dirname(os.path.realpath(__file__))

# Definování cesty ke složce s HTML soubory
html_folder = os.path.join(dir_path, "../")

# Přenastavení výstupního kódování
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

# Procházíme všechny soubory ve složce a všech jejích podsložkách
for root, dirs, files in os.walk(html_folder):
    for filename in files:
        if filename.endswith(".html"):
            print(f"Zpracovávám soubor: {filename}")

            # Otevření souboru a získání HTML
            with open(os.path.join(root, filename), "r", encoding="utf8") as file:
                soup = BeautifulSoup(file.read(), "html.parser")

            # Hledání všech h1-h6 tagů
            for h_tag in soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
                # Odstranění pouze <strong> tagů z h1-h6 tagů
                for tag in h_tag.find_all("strong"):
                    tag.unwrap()  # nahradí tag za jeho vnitřní obsah

            # Uložení změn do souboru
            with open(os.path.join(root, filename), "w", encoding="utf8") as file:
                file.write(str(soup))

print("Všechny HTML soubory byly úspěšně upraveny.")
