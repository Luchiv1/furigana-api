import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

const kuroshiro = new Kuroshiro();

const init = kuroshiro.init(new KuromojiAnalyzer());

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const text = url.searchParams.get("text") || "";

    await init;

    const result = await kuroshiro.convert(text, { to: "hiragana", mode: "normal" });

    return new Response(JSON.stringify({ original: text, hiragana: result }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
