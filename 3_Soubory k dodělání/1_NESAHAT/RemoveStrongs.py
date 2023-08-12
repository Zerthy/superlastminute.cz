import os
from bs4 import BeautifulSoup
import glob

# Projít všechny .html soubory v rodičovské složce a jejích podsložkách
for file_name in glob.glob("../**/*.html", recursive=True):
    with open(file_name, "r", encoding="utf8") as f:
        file_content = f.read()

    # Zpracujeme obsah HTML souboru
    soup = BeautifulSoup(file_content, "html.parser")

    # Najdeme všechny 'a' a 'strong' tagy
    a_tags = soup.find_all("a")
    strong_tags = soup.find_all("strong")

    # Odstraníme 'strong' tagy uvnitř 'a' tagů
    for tag in a_tags:
        if tag.strong:
            tag.strong.unwrap()

    # Odstraníme vnitřní 'strong' tagy v 'strong' tagu
    for tag in strong_tags:
        if tag.strong:
            tag.strong.unwrap()

    # Transformujeme '<strong><a href="/egypt-pyramidy/">pyramidy</a></strong>' na '<a href="/egypt-pyramidy/">pyramidy</a>'
    for tag in soup.find_all("strong"):
        if tag.a:
            tag.unwrap()

    # Uložíme upravený HTML soubor (přepíšeme originální soubor)
    with open(file_name, "w", encoding="utf-8") as f:
        f.write(str(soup))
