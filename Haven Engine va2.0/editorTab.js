const editor = document.querySelector("#secondaryEditorSection");
const tabs = editor.querySelectorAll(".tab");

export function changeTab(which) {
    tabs.forEach((tab, i) => {
        if(typeof which === "number" && i === which) {
            tab.style.display = "block";
        } else {
            tab.style.display = "none";
        }
    });

    if(typeof which === "string") {
        editor.querySelector(which).style.display = "block";
    }
}

export function currentTab() {
    return [...tabs].filter(tab => tab.style.display === "block")[0];
}

export function tabInfo() {
    let tab = currentTab();

    return tab.querySelectorAll("input");
}