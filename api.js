async function initHiraganaAPI() {
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer({ dictPath: "kuromoji" }));

  // Listen for POST-like requests
  window.addEventListener("message", async (event) => {
    if (!event.data || !event.data.text) return;

    const input = event.data.text;
    const output = await kuroshiro.convert(input, { to: "hiragana" });

    // Send back response
    event.source.postMessage({ result: output }, event.origin);
  });
}

initHiraganaAPI();
