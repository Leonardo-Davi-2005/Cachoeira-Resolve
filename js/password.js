const olhos = document.querySelectorAll(".olho");

olhos.forEach(olho => {

    olho.addEventListener("click", () => {

        const input = olho.parentElement.querySelector(".senha-input");

        if(input.type === "password"){
            input.type = "text";
            olho.textContent = "🙈";
        } else {
            input.type = "password";
            olho.textContent = "👁";
        }

    });

});