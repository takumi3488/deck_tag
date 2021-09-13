"use strict";
// localStorageの最初の呼び出し
const initialStorage = localStorage.getItem("tags");
let tags = initialStorage ? JSON.parse(initialStorage) : [];
// TextFieldを作成
const createTextfield = () => {
    const textfield = document.createElement("input");
    textfield.setAttribute("type", "text");
    textfield.setAttribute("class", "bg-color-twitter-white txt-size--14 padding-a--0 compose-textfield");
    textfield.setAttribute("placeholder", "新しいタグを追加");
    textfield.setAttribute("id", "new-tag-field");
    textfield.addEventListener("keydown", createTag);
    return textfield;
};
// TextFieldをラップして埋め込む
const appendTextfield = (textfield) => {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "position-rel compose-text-container padding-a--10 br--4 margin-b--12");
    const hashtagSpan = document.createElement("span");
    hashtagSpan.setAttribute("class", "text-size--14 hashtag-span");
    hashtagSpan.innerText = "#";
    wrapper.appendChild(hashtagSpan);
    const timer = setInterval(() => {
        if (document?.getElementsByClassName("compose-text-container").length > 0) {
            const textarea = document.getElementsByClassName("compose-text-container")[0];
            const textareaClass = textarea.getAttribute("class");
            textarea.setAttribute("class", `${textareaClass} margin-b--12`);
            wrapper.appendChild(textfield);
            textarea.after(wrapper);
            clearInterval(timer);
        }
    }, 500);
};
// タグの保存と一覧の再表示
const createTag = (e) => {
    const target = e.target;
    const value = target.value;
    if (e.isComposing || e.keyCode !== 13 || value.length === 0) {
        return;
    }
    const newTag = value.replaceAll("#", "");
    tags.push(newTag);
    tags = [...new Set(tags)];
    localStorage.setItem("tags", JSON.stringify(tags));
    target.value = "";
    showTags(newTag);
};
// タグの表示
const showTags = (newTag) => {
    const timer = setInterval(() => {
        if (document?.getElementsByClassName("compose-text-container").length > 0) {
            const textarea = document.getElementsByClassName("compose-text-container")[0];
            if (newTag) {
                textarea.after(createTagButton(newTag));
            }
            else {
                tags.forEach((tag) => {
                    textarea.after(createTagButton(tag));
                });
            }
            clearInterval(timer);
        }
    }, 500);
};
// タグボタン(1個)の作成
const createTagButton = (tagText) => {
    const button = document.createElement("button");
    button.setAttribute("class", "btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12 tag-button");
    button.setAttribute("id", tagText);
    button.addEventListener("click", () => putTagInTextarea(tagText));
    const icon = document.createElement("i");
    icon.setAttribute("class", "Icon icon-remove");
    icon.addEventListener("click", (e) => {
        removeTag(tagText);
        e.stopPropagation();
    });
    const textSpan = document.createElement("span");
    textSpan.innerText = `#${tagText}`;
    textSpan.setAttribute("class", "label padding-ls");
    button.appendChild(textSpan);
    button.appendChild(icon);
    return button;
};
// タグの削除
const removeTag = (tag) => {
    const tagButton = document.getElementById(tag);
    tagButton?.remove();
    tags = tags.filter((t) => t !== tag);
    localStorage.setItem("tags", JSON.stringify(tags));
};
// textareaにタグを入力
const putTagInTextarea = (tag) => {
    const textarea = document.getElementsByClassName("compose-text")[0];
    const value = textarea.value;
    if (value.length > 0) {
        textarea.value = `${value} #${tag}`;
    }
    else {
        textarea.value = `#${tag}`;
    }
    const changeEvent = new Event('change');
    textarea.dispatchEvent(changeEvent);
};
const main = () => {
    const textfiled = createTextfield();
    appendTextfield(textfiled);
    showTags();
};
main();
