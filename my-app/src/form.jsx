import React from "react";
import { useState, useEffect } from "react";
import './App.css'

function Foam() {

    // 各項目の初期値を設定する
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        address: "",
        contents: "",
        other: "",
    });

    // 各項目の日本語晩を設定する
    const [formDataTitle, setFormDataTitle] = useState([
        { key: "name", title: "名前" },
        { key: "age", title: "年齢" },
        { key: "address", title: "メールアドレス" },
        { key: "contents", title: "お問い合わせ内容" },
        { key: "other", title: "その他" },
    ]);
    
    // フィールドごとのエラーメッセージを管理
    const [errors, setErrors] = useState({}); 

    // ポップアップの表示・非表示を管理
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // ポップアップの横幅を管理
    const [popupWidth, setPopupWidth] = useState("auto");

    // ポップアップの横幅の上限を設定
    const MAX_WIDTH = 600; 

    // ポップアップの横幅の最小値を設定
    const MIN_WIDTH = 300; 

    // 更新の処理
    const handleChange = (e) => {

        // 入力された内容をリアルタイムで更新
        const { id, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));

        {/* なぜか機能しない...泣 */}
        // 入力が行われたらエラーをクリア
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };

            // formDataTitleから対応するタイトルを取得
            const field = formDataTitle.find((field) => field.key === id);
            const title = field ? field.title : id; // フォールバックとしてidを使用

            if (value) {
              delete updatedErrors[id]; // 入力済みの場合、該当フィールドのエラーを削除
            } else {
              updatedErrors[id] = `${title}を入力してください。`; // 再度空になった場合エラーを設定
            }
            return updatedErrors;
        });
    };


    // 確認の処理
    const handleConfirm = () => {

        // 必須項目のチェック
        const newErrors = {};
        if (!formData.name) newErrors.name = "名前を入力してください。";
        if (!formData.age) newErrors.age = "年齢を入力してください。";
        if (!formData.address) newErrors.address = "メールアドレスを入力してください。";
        if (!formData.contents) newErrors.contents = "問い合わせ内容を入力してください。";
        
        // エラー状況を更新
        setErrors(newErrors);
    
        // エラーがない場合のみポップアップを表示
        if (Object.keys(newErrors).length === 0) {
          setIsPopupVisible(true);
        }
      };
    

    // 送信の処理
    const handleSend = () => {

        // アラートとコンソールに表示
        alert("送信完了しました！", formData);
        console.log("フォーム内容:", formData);

        // ローカルストレージにデータを配列形式で保存
        const existingData = JSON.parse(localStorage.getItem("formDataList")) || [];

        // 新しいデータを追加
        const updatedData = [...existingData, formData]; 

        // 再度、データをローカルストレージに保存
        localStorage.setItem("formDataList", JSON.stringify(updatedData));

        // ポップアップを閉じる
        setIsPopupVisible(false);
    };

    
    // ポップアップを閉じる
    const closePopup = () => {
        setIsPopupVisible(false);
    };

    // ポップアップの横幅を動的に設定
    useEffect(() => {
        if (isPopupVisible) {
            // 全ての入力値を連結して、その長さに基づいて横幅を決定
            const totalLength = Object.values(formData).join("").length;
            const calculatedWidth = Math.max(
                MIN_WIDTH,
                Math.min(MAX_WIDTH, totalLength * 10) // 最小幅を超え、上限を超えない範囲で横幅を設定
            );
            setPopupWidth(`${calculatedWidth}px`);
        }
    }, [isPopupVisible, formData]);

    {/* HTMLを表示 */}
    return (
        <>
        <div className="inquiry-container">
            {/* 入力エリア */}
            <div className="foam-area">
                {formDataTitle.map(({ key, title }) => {

                    //  項目名が『名前』だったら？
                    {key === "name" &&
                        <div key={key} className="input-area1">
                            <h3>{title}</h3>
                            <input
                                type="text"
                                id={key}
                                className={`input1 ${errors[key]  ? "error-field" : ""}`} // エラー発生時にエラーCSSを付ける
                                placeholder={`${title}を入力`}
                                value={formData[key]}
                                onChange={handleChange}
                            />
                            {/* エラーメッセージを表示 */}
                            {errors[key] && 
                                <p className="error-message1">
                                    {errors[key]} 
                                </p>
                            }
                        </div>
                    }

                    //  項目名が『年齢』だったら？
                    {key ===  "age" &&
                        <div key={key} className="input-area2">
                            <h3>{title}</h3>
                            <input
                                type="text"
                                id={key}
                                className={`input2 ${errors[key]  ? "error-field" : ""}`} // エラー発生時にエラーCSSを付ける
                                placeholder={`${title}を入力`}
                                value={formData[key]}
                                onChange={handleChange}
                            />
                            {/* エラーメッセージを表示 */}
                            {errors[key] && 
                                <p className="error-message2">
                                    {errors[key]}
                                </p>
                            }
                        </div>
                    }

                    //  項目名が『その他』だったら？
                    {key ===  "other" &&
                        <div key={key} className="input-area3">
                            <h3>{title}（任意）</h3>
                            <input
                                type="text"
                                id={key}
                                className="input3"
                                placeholder={`${title}`}
                                value={formData[key]}
                                onChange={handleChange}
                            />
                        </div>
                    }

                    //  項目名が上記以外だったら？
                    return (
                        <div key={key} className="input-area3">
                            <h3>{title}</h3>
                            <input
                                type="text"
                                id={key}
                                className={`input3 ${errors[key]  ? "error-field" : ""}`} // エラー発生時にエラーCSSを付ける
                                placeholder={`${title}を入力`}
                                value={formData[key]}
                                onChange={handleChange}
                            />
                                {/* エラーメッセージを表示 */}
                                {errors[key] && 
                                    <p className="error-message2">
                                        {errors[key]}
                                    </p>
                                }
                        </div>
                    );
                })}
            </div>
            <div className="btn-area">
                <h3>上記、入力完了後に下記のボタンを押してください</h3> 
                <button id="checkbtn" className="btn" onClick={handleConfirm}>確認</button>
            </div>
            {/* ポップアップ */}
            {isPopupVisible && (
                <div className="popup-area">
                    <div className="popup" style={{ width: popupWidth }}>
                        <button class="closebtn" onClick={closePopup}>✕</button>
                        <h3>お問い合わせ内容の確認</h3>
                        <p>
                            確認・編集が可能です！<br />
                            『送信』を押して問い合わせを完了してください。
                        </p>
                        {formDataTitle.map(({ key, title }) => (
                            <div key={key} className="popup-input-area">
                                <h4>{title}</h4>
                                <textarea
                                    id={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    className="popup-textarea"
                                />
                            </div>
                        ))}
                        <button className="sendbtn" onClick={handleSend}>送信</button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}

export default Foam;