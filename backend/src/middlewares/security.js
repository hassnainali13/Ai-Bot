function isMaliciousInput(text) {
  const blocked = [
    "ignore instructions",
    "system prompt",
    "who trained you",
    "are you an ai",
    "google gemini",
    "model details",
  ];

  return blocked.some(word =>
    text.toLowerCase().includes(word)
  );
}

module.exports = isMaliciousInput;
