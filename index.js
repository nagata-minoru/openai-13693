/*
 * OpenAIのAPIを使用して画像を生成する。
 */

(() => {
  /*
   * まず、XMLHttpRequestオブジェクトを使用してAPIエンドポイントにPOST
   * リクエストを作成し、APIキーをHTTPリクエストのヘッダーに追加する。
   * 次に、リクエストのボディに、生成する画像に関するパラメータを追加
   * して送信する。その後、XMLHttpRequestオブジェクトを使用してサーバー
   * からのレスポンスを取得し、待ち受ける。最後に、サーバーからのレス
   * ポンスを取得し、画像のURLを取得する。
   */
  const getImageUrl = async () => {
    wait.hidden = false;
    error.innerText = "";

    const request = new XMLHttpRequest();
    const apiUrl = "https://api.openai.com/v1/images/generations"; // APIエンドポイントのURLを指定する。
    request.open("POST", apiUrl, true); // POSTリクエストを作成する。
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

  /*
   * OpenAIのAPIを使用して画像を編集する。
   */
  const getEditImageUrl = async () => {
    wait.hidden = false;
    error.innerText = "";

    const formData = new FormData(); // FormDataオブジェクトを生成する。

    // HTMLのinput要素からファイルを取得する。
    const fileInput = file_input;
    const file = fileInput.files[0];

    formData.append("prompt", prompt_area.value); // プロンプトを追加する。
    formData.append("size", "512x512"); // サイズを指定する
    formData.append("image", file); // ファイルを追加する。

    const request = new XMLHttpRequest(); // XMLHttpRequestオブジェクトを生成する。

    request.open("POST", "https://api.openai.com/v1/images/edits"); // POSTリクエストを作る。
    request.setRequestHeader("Authorization", `Bearer ${api_key.value}`); // APIキーをHTTPリクエストのヘッダーに追加する。
    request.send(formData); // リクエストボディを設定する。

    // レスポンスを待つ。
    await new Promise((resolve, reject) => {
      request.onreadystatechange = function () {
        if (request.readyState != 4) return;
        if (request.status >= 400) {
          reject(request.response);
        }
        resolve();
      };
    }).catch((e) => (error.innerText = e));

    document.cookie = `api_key=${api_key.value}`;
    image.onload = () => (wait.hidden = true);
    image.src = JSON.parse(request.response).data[0].url;
  };

  const setPreview = (input) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(input.files[0]);
    fileReader.onload = () => (image.src = fileReader.result);
  };

  generate_button.onclick = () => getImageUrl(); // イベントハンドラを設定する。

  file_input.onchange = () => setPreview(file_input);

  edit_button.onclick = () => getEditImageUrl();

  /*
   * Cookieから特定のキーの値を取得する。
   */
  const getCookie = (key) => {
    const re = new RegExp(`^${key}=`);
    const res = decodeURIComponent(document.cookie)
      .split(";")
      .filter((s) => re.test(s))[0];

    return !!res ? res.split("=")[1] : null;
  };

  const key = getCookie("api_key");
  api_key.value = !!key ? key : "";
})();
