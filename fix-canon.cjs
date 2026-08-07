const fs = require('fs');
const path = require('path');

const filePath = '/Users/vinicius/Documents/projetos/front/react/Holy-Bible/src/features/bible-custom/constants/canon-data.ts';
let content = fs.readFileSync(filePath, 'utf8');

// We can just execute the current file by transforming it slightly to extract the arrays
const scriptContent = content.replace('export const CANON_DATA', 'const CANON_DATA').replace('export const CANON_DATA_ENGLISH', 'const CANON_DATA_ENGLISH') + '\nmodule.exports = { CANON_DATA, CANON_DATA_ENGLISH };';

const tempPath = path.join(__dirname, 'temp-canon-data.js');
fs.writeFileSync(tempPath, scriptContent.replace(/import .*/g, ''));

const { CANON_DATA, CANON_DATA_ENGLISH } = require(tempPath);

const enPhaseMap = new Map();
for (const phase of CANON_DATA_ENGLISH) {
  enPhaseMap.set(phase.id, phase);
}

const getEnBook = (phaseId, bookId) => {
  const phase = enPhaseMap.get(phaseId);
  if (!phase) return null;
  return phase.books.find(b => b.id === bookId);
};

const NEW_CANON_DATA_ENGLISH = JSON.parse(JSON.stringify(CANON_DATA));

for (const phase of NEW_CANON_DATA_ENGLISH) {
  const enPhase = enPhaseMap.get(phase.id);
  if (enPhase) {
    if (enPhase.title) phase.title = enPhase.title;
    if (enPhase.div) phase.div = enPhase.div;
    else delete phase.div; // if not in EN, remove or keep PT? If EN had no div, maybe it shouldn't have div. Wait, if PT has div, let's see if EN had it translated.
  }
  
  for (const book of phase.books) {
    const enBook = getEnBook(phase.id, book.id);
    if (enBook) {
      book.name = enBook.name;
      book.sub = enBook.sub;
      if (enBook.tipo) book.tipo = enBook.tipo;
      if (enBook.procedencia) book.procedencia = enBook.procedencia;
      if (enBook.observacao) book.observacao = enBook.observacao;
      if (enBook.isbn) book.isbn = enBook.isbn;
      if (enBook.foco) book.foco = enBook.foco;
    } else {
      // Missing in EN, it will keep PT names for now.
      // We can translate known ones here:
      if (book.id === 'b0_8') {
        book.name = "The Kybalion";
        book.sub = "Three Initiates — The seven hermetic principles that govern the hidden truth and the laws of the mind";
      } else if (book.id === 'b269_add1') {
        book.name = "The Three Steles of Seth";
        book.sub = "Hymns of adoration and revelations of the pure Sethian lineage";
      } else if (book.id === 'b269_add2') {
        book.name = "Allogenes";
        book.sub = "The Stranger and his mental transcendence beyond the Demiurge";
      }
    }
  }
}

// Convert back to TS string
let newEnStr = 'export const CANON_DATA_ENGLISH: Phase[] = ' + JSON.stringify(NEW_CANON_DATA_ENGLISH, null, 2) + ';\n';

// The file should have CANON_DATA untouched, and then CANON_DATA_ENGLISH replaced.
const enIndex = content.indexOf('export const CANON_DATA_ENGLISH');
const newContent = content.substring(0, enIndex) + newEnStr;

fs.writeFileSync(filePath, newContent);
console.log('Fixed CANON_DATA_ENGLISH');
