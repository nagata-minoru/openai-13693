/*
 * OpenAIのAPIを使用して画像を生成する。
 */

(() => {
  const getImageUrl = async () => {
    wait.hidden = false;
    error.innerText = "";

    const request = new XMLHttpRequest();
    const apiUrl = "https://api.openai.com/v1/images/generations"; // APIエンドポイントのURLを指定する。
    request.open("POST", apiUrl, true); // GETリクエストを作成する。
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Authorization", `Bearer ${api_key.value}`); // APIキーをHTTPリクエストのヘッダーに追加する。

    request.send(
      JSON.stringify({
        // リクエストのボディに、生成する画像に関するパラメータを追加して送信する。
        model: "image-alpha-001",
        prompt: prompt_area.value,
        size: "512x512",
      })
    );

    // XMLHttpRequestオブジェクトを使用してサーバーからのレスポンスを取得する。
    const response = await new Promise((resolve, reject) => {
      // リクエストを待ち受ける。
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          // サーバーからのレスポンスを取得する。
          resolve(this.response);
        } else {
          // エラーの場合
          reject(this.response);
        }
      };
      request.onerror = function () {
        reject(this.response.message);
      };
    }).catch((e) => {
      error.innerText = e;
    });

    wait.hidden = true;
    if (!response) return;

    document.cookie = `api_key=${api_key.value}`;
    image.src = JSON.parse(response).data[0].url;
  };

  generate_button.onclick = () => getImageUrl(); // イベントハンドラを設定する。

  /*
   * Cookieから特定のキーの値を取得する。
   */
  const getCookie = (key) => {
    const re = new RegExp(`^${key}=`);
    const res = decodeURIComponent(document.cookie)
      .split(";")
      .filter((s) => re.test(s))[0];

    return !!res ? res.split("=")[1] : null;
  }

  const key = getCookie("api_key");
  api_key.value = !!key ? key : "";
})();
