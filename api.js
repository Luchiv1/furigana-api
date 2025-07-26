async function initHiraganaAPI() {
  const kuroshiro = new Kuroshiro();

  // Build kuromoji tokenizer
  const tokenizer = await new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: "kuromoji" }).build((err, tokenizer) => {
      if (err) reject(err);
      else resolve(tokenizer);
    });
  });

  // Polyfill the KuromojiAnalyzer if it's not already available
  if (!Kuroshiro.Analyzer) {
    Kuroshiro.Analyzer = {};
  }

  if (!Kuroshiro.Analyzer.Kuromoji) {
    class KuromojiAnalyzer {
      constructor(tokenizer) {
        this.tokenizer = tokenizer;
      }

      async init() {
        return;
      }

      async tokenize(text) {
        return this.tokenizer.tokenize(text);
      }
    }

    Kuroshiro.Analyzer.Kuromoji = KuromojiAnalyzer;
  }

  // Initialize Kuroshiro with the adapter
  await kuroshiro.init(new Kuroshiro.Analyzer.Kuromoji(tokenizer));

  // Expose for global use
  window.kuroshiro = kuroshiro;

  // Optional: postMessage support
  window.addEventListener("message", async (event) => {
    if (!event.data || !event.data.text) return;
    const input = event.data.text;
    const output = await kuroshiro.convert(input, { to: "hiragana" });
    event.source.postMessage({ result: output }, event.origin);
  });
}

initHiraganaAPI();
