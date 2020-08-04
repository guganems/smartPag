class SmartPag {
    constructor(items, config) {
        this.config = config;
        this.items = items;
        this.pagesBtns = Math.ceil(this.items.length / this.config.quantity);
        this.starter = 0;
        this.init();
    }

    init() {
        // TODO: initialization of the first page
        this.container = document.getElementById('container');

        // TODO: add buttons
        this.drawTable();

        let newBtns = ``;
        for (let i = 1; i <= this.pagesBtns; i++) {
            newBtns += `
                <button style="margin: 0 5px" class="${i}">${i}</button>
            `;
        }

        this.container.innerHTML += `
            <div style="display: flex; padding-top: 5px">
                <button class="pre">pre</button>
                    <div class="btns">
                        ${newBtns}
                    </div>
                <button class="next">next</button>
            </div>
        `;

        this.chnageItems();
        this.addText();
    }

    drawTable() {
        // TODO: draws it
        let newDivs = ``;
        for (let i = this.starter; i < this.starter + this.config.quantity; i++) {
            if (i < this.items.length) {
                let cell = "";
                for (let key = 0; key < this.config.keys.length; key++) {
                    let hide = "";
                    let isEditable = "";
                    if (this.config.keys[key].hide) {
                        hide = "smart-pag-hide";
                    }
                    if(this.config.keys[key].edit) {
                        isEditable = "smart-pag-editable";
                    }
                    cell += `
                        <div class="smart-pag-table-cell ${hide} ${isEditable}" data-key="${key}" data-item="${i}" contenteditable="${this.config.keys[key].edit}">${this.items[i][this.config.keys[key].name] ? this.items[i][this.config.keys[key].name] : ""}</div>
                    `
                }
                newDivs += `
                <div class="smart-pag-table-row" style="display: flex; margin: 5px 0">
                    ${cell}
                </div>
            `;
            }
        }

        let header = "";

        this.config.keys.forEach(e =>  {
            let isHidden = "";
            if(e.hide) {
                isHidden = "smart-pag-hide";

            }
            header += `
                <h3 style="margin: 5px" class="${isHidden}">${e.header}</h3>
            `;
        });

        this.container.innerHTML = `
            <div style="">
                <div style="display: flex">
                    ${header}
                </div>
                ${newDivs}
            </div>
        `;
    }


    chnageItems() {
        // TODO: set new items

        document.querySelectorAll('button').forEach(e => {
            let me = this;
            e.addEventListener('click', function () {
                if (e.classList.contains('pre')) {
                    if (me.starter > 0) {
                        me.starter -= me.config.quantity;
                        me.init();
                    }
                }
                else if (e.classList.contains('next')) {
                    if (me.starter < me.items.length - me.config.quantity) {
                        me.starter += me.config.quantity;
                        me.init();
                    }
                }
                else if (e.parentElement.classList.contains('btns')) {
                    me.starter = Number(e.textContent) * me.config.quantity - me.config.quantity;
                    me.init();
                }
            });
        });

    }

    addText() {
            document.querySelectorAll('.smart-pag-editable').forEach(e => {
            let me = this;
            e.addEventListener('keyup', () => {
                this.items[e.dataset.item][this.config.keys[2]] = e.innerText;
            });
            this.items = me.items;
            // console.log(this.items);
        });
    }

}

