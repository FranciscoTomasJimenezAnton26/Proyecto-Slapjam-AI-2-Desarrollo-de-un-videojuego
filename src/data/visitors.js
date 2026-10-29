// Los visitantes de Doorbell Dash.
// Cada uno tiene una versión niño y una versión monstruo con UNA pista distinta.
// Imágenes (opcionales): assets/img/<id>-kid.png y assets/img/<id>-monster.png
// Si no existen, el juego dibuja un personaje provisional con formas.
const VISITORS = [
  { id: 'ghost',     name: 'Ghost',     color: 0xf2f0f7, clue: 'tail' },
  { id: 'vampire',   name: 'Vampire',   color: 0x2a1a3a, clue: 'float' },
  { id: 'witch',     name: 'Witch',     color: 0x7b3fbf, clue: 'eyes' },
  { id: 'mummy',     name: 'Mummy',     color: 0xe8dcc0, clue: 'claws' },
  { id: 'pumpkin',   name: 'Pumpkin',   color: 0xff8a1f, clue: 'fangs' },
  { id: 'skeleton',  name: 'Skeleton',  color: 0x1c1c24, clue: 'horns' },
  { id: 'pirate',    name: 'Pirate',    color: 0x8a3a2a, clue: 'tentacle' },
  { id: 'superhero', name: 'Superhero', color: 0x2f5fd0, clue: 'fur' },
];

// Lo que dice el juego cuando te equivocas, para que aprendas la pista
const CLUE_HINTS = {
  tail: 'Look for a TAIL!',
  float: 'Its feet were FLOATING!',
  eyes: 'Its eyes were GLOWING!',
  claws: 'It had CLAWS!',
  fangs: 'It had FANGS!',
  horns: 'It had HORNS!',
  tentacle: 'That leg was a TENTACLE!',
  fur: 'Those hands were FURRY!',
};
