async function initHiraganaAPI() {
  const kuroshiro = new Kuroshiro();

  // Manually initialize tokenizer
  const tokenizer = await new Promise((resolve) => {
    kuromoji.builder({ dicPath: "kuromoji" }).build((err, tokenizer) => {
      if (err) throw err;
      resolve(tokenizer);
    });
  });

  await kuroshiro.init(tokenizer);

  // Expose globally for button test
  window.kuroshiro = kuroshiro;

  // Listen for postMessage (optional)
  window.addEventListener("message", async (event) => {
    if (!event.data || !event.data.text) return;
    const input = event.data.text;
    const output = await kuroshiro.convert(input, { to: "hiragana" });
    event.source.postMessage({ result: output }, event.origin);
  });
}

initHiraganaAPI();
