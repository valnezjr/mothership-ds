"""Avalia cores sólidas dos gráficos em superfícies de referência (CIELAB ΔE76).

Matrizes: Machado, Oliveira e Fernandes (2009), gravidade máxima, RGB linear.
https://pubmed.ncbi.nlm.nih.gov/19834201/
Não avalia composição, gradientes, texto ou fundos dinâmicos.
"""
from itertools import combinations
from math import dist
from pathlib import Path
import re

css = (Path(__file__).resolve().parent.parent / "src/styles/tokens.css").read_text()
block = css.split("/* Paleta mais luminosa para gráficos sobre superfícies escuras.", 1)[1].split("}", 1)[0]
colors = [re.search(rf"--chart-{n}:\s*#([0-9a-fA-F]{{6}})", block)[1] for n in range(1, 5)]
matrices = {
    "normal": ((1, 0, 0), (0, 1, 0), (0, 0, 1)),
    "protanopia": ((.152286, 1.052583, -.204868), (.114503, .786281, .099216), (-.003882, -.048116, 1.051998)),
    "deuteranopia": ((.367322, .860646, -.227968), (.280085, .672501, .047413), (-.011820, .042940, .968881)),
}
surfaces = {"Aerobubble": "111114", "Flat": "232327", "Paperpen (aproximação)": "283864"}


def linear(hex_color):
    rgb = [int(hex_color[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in rgb]


def luminance(rgb):
    return sum(a * b for a, b in zip((.2126, .7152, .0722), rgb))


def lab(rgb):
    r, g, b = rgb
    xyz = ((.4124564*r + .3575761*g + .1804375*b) / .95047,
           .2126729*r + .7151522*g + .072175*b,
           (.0193339*r + .119192*g + .9503041*b) / 1.08883)
    f = lambda x: x ** (1/3) if x > .0088564517 else 7.787037*x + 16/116
    x, y, z = map(f, xyz)
    return (116*y-16, 500*(x-y), 200*(y-z))


for condition, matrix in matrices.items():
    simulated = []
    for color in colors:
        rgb = linear(color)
        simulated.append(lab([max(0, min(1, sum(a*b for a, b in zip(row, rgb)))) for row in matrix]))
    differences = [(dist(simulated[i], simulated[j]), i+1, j+1) for i, j in combinations(range(4), 2)]
    smallest, a, b = min(differences)
    print(f"{condition}: menor ΔE76 {smallest:.2f} (séries {a} e {b})")
    assert smallest >= (15 if condition == "normal" else 8)

for name, surface in surfaces.items():
    bg = luminance(linear(surface))
    ratios = [(max(bg, luminance(linear(c))) + .05) / (min(bg, luminance(linear(c))) + .05) for c in colors]
    print(f"{name}: menor contraste {min(ratios):.2f}:1")
    assert min(ratios) >= 3
