
document.addEventListener("DOMContentLoaded", function () {
    const filterBtn = document.getElementById('filter-btn');
    const btnTxt = document.getElementById('btn-txt');
    const filterAngle = document.getElementById('filter-angle');
    const filterbar = $('#filterbar');
    const innerBox = $('#inner-box');
    const innerBox2 = $('#inner-box2');
    const icon = document.getElementById('icon');
    const inputLeft = document.getElementById("input-left");
    const inputRight = document.getElementById("input-right");
    const thumbLeft = document.querySelector(".slider > .thumb.left");
    const thumbRight = document.querySelector(".slider > .thumb.right");
    const range = document.querySelector(".slider > .range");
    const amountLeft = document.getElementById('amount-left');
    const amountRight = document.getElementById('amount-right');
    let count = 0, count2 = 0;

    filterbar.collapse(false);
    innerBox.collapse(false);
    innerBox2.collapse(false);

    function changedBtnTxt() {
        filterbar.collapse('toggle');
        count++;
        if (count % 2 !== 0) {
            filterAngle.classList.add("fa-angle-right");
            btnTxt.innerText = "show filters";
            filterBtn.style.backgroundColor = "#0a0a0a";
        } else {
            filterAngle.classList.remove("fa-angle-right");
            btnTxt.innerText = "hide filters";
            filterBtn.style.backgroundColor = "#15877C";
        }
    }

   
    function chnageIcon() {
        count2++;
        if (count2 % 2 !== 0) {
            icon.innerText = "";
            icon.innerHTML = '<span class="far fa-times-circle" style="width:100%"></span>';
            icon.style.paddingTop = "5px";
            icon.style.paddingBottom = "5px";
            icon.style.fontSize = "1.8rem";
        } else {
            icon.innerText = "";
            icon.innerHTML = '<span class="navbar-toggler-icon"></span>';
            icon.style.paddingTop = "5px";
            icon.style.paddingBottom = "5px";
            icon.style.fontSize = "1.2rem";
        }
    }

    function initializeTooltip() {
        $('[data-tooltip="tooltip"]').tooltip();
    }

    function setLeftValue() {
        setSliderValue(inputLeft, thumbLeft, amountLeft);
    }

    function setRightValue() {
        setSliderValue(inputRight, thumbRight, amountRight);
    }

    function setSliderValue(_this, thumb, amount) {
        const min = parseInt(_this.min);
        const max = parseInt(_this.max);
        _this.value = Math.min(parseInt(_this.value), parseInt(_this === inputLeft ? inputRight.value : inputLeft.value) - 1);
        const percent = ((_this.value - min) / (max - min)) * 100;
        thumb.style[_this === inputLeft ? 'left' : 'right'] = percent + "%";
        range.style[_this === inputLeft ? 'left' : 'right'] = percent + "%";
        amount.innerText = parseInt(percent * 100);
    }

    function handleSliderEvents(_this, thumb) {
        _this.addEventListener("input", () => setSliderValue(_this, thumb, _this === inputLeft ? amountLeft : amountRight));
        _this.addEventListener("mouseover", () => thumb.classList.add("hover"));
        _this.addEventListener("mouseout", () => thumb.classList.remove("hover"));
        _this.addEventListener("mousedown", () => thumb.classList.add("active"));
        _this.addEventListener("mouseup", () => thumb.classList.remove("active"));
    }

    filterBtn.addEventListener("click", changedBtnTxt);
    icon.addEventListener("click", chnageIcon);
    initializeTooltip();
    setLeftValue();
    setRightValue();
    handleSliderEvents(inputLeft, thumbLeft);
    handleSliderEvents(inputRight, thumbRight);
});
