class CalcController {

    constructor(){
        // _ antes do atributo indica encapsulamento privado (private - somente a mesma classe pode acionar)

        this._audioOnOff = 'false'
        this._clickSong = new Audio('click.mp3')
        this._lastOperator = ''
        this._lastNumber = ''

        this._locale = "pt-BR"
        this._displayCalcEl = document.querySelector("#display")
        this._timeCalcEl = document.querySelector("#hora")
        this._dateCalcEl = document.querySelector("#data")
        this._operation = []

        this.initialize()
        this.initButtonsEvent()
        this.initKeyBoard()

}

    initialize(){

        //executa uma primeira vez pra não começar a tela zerada
        this.setDysplayDateTime()

        // Executa esse código a cada 1000 milisegundos (1 segundo)
        setInterval(()=>{
            this.setDysplayDateTime()
        }, 1000)

        this.pasteToClipBoard()

        document.querySelectorAll('.btn-ac').forEach(btn =>{
            btn.addEventListener('dblclick', e =>{
                this.toogleAudio()
            })
        })

    }

    toogleAudio(){

        this._audioOnOff = !this._audioOnOff

    }

    playAudio(){
        if(this._audioOnOff){
            this._clickSong.currentTime = 0
            this._clickSong.play()
        }
    }

    pasteToClipBoard(){
        document.addEventListener('paste', e=>{
            let data = e.clipboardData.getData('Text')

            this.calcDisplay = parseFloat(data)
        })
    }

    copyToClipBoard(){
        //cria elemento no body para capturar o valor da calculadora e copiar
        let input = document.createElement('input')

        input.value = this.calcDisplay
        
        document.body.appendChild(input)

        input.select()

        document.execCommand("Copy")

        input.remove()

    }

    addEventListenerAll(element, events, fn){
        
        events.split(" ").forEach( event =>{

            element.addEventListener(event, fn)
            })
    
    }

    setError(){
        this.calcDisplay = "Error"
    }

    allClear(){
        this._operation = []
        this._lastNumber = ''
        this._lastOperator = ''
        this.setLastNumberDisplay()
        console.clear()
        
    }

    cancelEntry(){
        console.log("Cancel Entry")
        this._operation.pop()
        console.log(this._operation)
        this._lastNumber = ''
        this._lastOperator = ''
        this.setLastNumberDisplay()
    }

    getLastOperation(){
        return this._operation[this._operation.length -1]
    }

    isOperator(value){
        return (['+', '-', '*', '/', '%', '='].indexOf(value) > -1)
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value
    }

    pushOperation(value){
        this._operation.push(value);

        if(this._operation.length > 3 || value == '%'){
            this.calc()
        }
    }

    getResult(){
        try{
            return eval(this._operation.join(''))
        } catch(e){
            setTimeout(()=> {
                this.setError()
            }, 1)
        
        }
        
    }

    calc(){
        let last = ''
        let result = ''
        this._lastOperator = this.getLastItem()

        if(this._operation.length < 3) {
            let firstItem = this._operation[0]
            this._operation = [firstItem, this._lastOperator, this._lastNumber]
            console.log('menor que 3')
        }

        if(this._operation.length >3){
            console.log('maior que 3')
             last = this._operation.pop()

              result = this.getResult()
              this._lastNumber = this.getResult()

        } else if(this._operation.length == 3){
            console.log('= 3')

            this._lastNumber = this.getLastItem(false)
        }

        console.log("last operator", this._lastOperator)
        console.log("last number", this._lastNumber)
        
         result = this.getResult()

        if(last == '%'){
            console.log("porcentagem")
            result /= 100;

            this._operation = [result]

        } else{
            this._operation = [result];

            if(last){
                this._operation.push(last)
            } 
        }


        
        this.setLastNumberDisplay();

    }

    getLastItem(isOperator = true){
        let lastItem

        for(let i = this._operation.length-1;i>=0;i--){

                if(this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i]
                    break
                }
        }

        if (!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber
        }

        return lastItem
    }

    setLastNumberDisplay(){
        let lastNumber = this.getLastItem(false)

        console.log(lastNumber)
        this.calcDisplay = lastNumber;

        if(!lastNumber){
            this.calcDisplay = 0;
        }
    }

    initKeyBoard(){
        document.addEventListener('keyup', e => {
            this.playAudio()

            switch (e.key) {
            case "Escape":
                this.allClear()
                break
            case "Backspace":
                this.cancelEntry()
                break
            case "%":
            case "/":
            case "*":
            case "-":
            case "+":

                this.addOperation(e.key)
                break
            case "Enter":
            case "=":
                this.calc()
                break
            case ".":
            case ",":
                this.addDot()
                break

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":

            this.addOperation(parseFloat(e.key))
            break
            case 'c':
                if(e.ctrlKey) {
                    this.copyToClipBoard()
                }
                break
            default:
                //this.setError()
                break
            
        }
        })
    }
    

    addOperation(value){

        if(isNaN(this.getLastOperation())){
           //string
            if(this.isOperator(value)){
                //trocar de operador
                this.setLastOperation(value)

            } else if(isNaN(value)){

            } else{
                //Primeira entrada na calculadora
                this.pushOperation(value)

                this.setLastNumberDisplay()
            }
        } else if(isNaN(value)){
            this.pushOperation(value)

        }else {
            //number 
            let newValue = this.getLastOperation().toString() + value.toString()
            this.setLastOperation(newValue)

            this.setLastNumberDisplay()

            }

        
        console.log(this._operation)

    }

    addDot(){
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.')) return

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.')
        } else{
            this.setLastOperation(lastOperation.toString() + '.')
        }

        this.setLastNumberDisplay()
    }

    execBtn(value){
        this.playAudio()

        switch (value) {
            case "ac":
                this.allClear()
                break
            case "ce":
                this.cancelEntry()
                break
            case "porcento":
                this.addOperation('%')
                break
            case "divisao":
                this.addOperation('/')
                break
            case "multiplicacao":
                this.addOperation('*')
                break
            case "subtracao":
                this.addOperation('-')
                break
            case "soma":
                this.addOperation('+')
                break
            case "igual":
                this.calc()
                break
            case "ponto":
                this.addDot()
                break

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":

            this.addOperation(parseFloat(value))
            break
            default:
                this.setError()
                break
            
        }

    }

    initButtonsEvent(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g")

        //Cria um for each para adicionar evento de click em cada botão
        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = (btn.className.baseVal.replace("btn-", ""))

                this.execBtn(textBtn)
            })

            

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
                btn.style.cursor = "pointer"
            })
        })


    }

    //Método para puxar data atual e mostrar ni display e como customizar as datas
    setDysplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        this._timeCalcEl.innerHTML
    }

    set displayTime(value){
        this._timeCalcEl.innerHTML = value
    }

    get displayDate(){
        this._dateCalcEl.innerHTML
    }

    set displayDate(value){
        this._dateCalcEl.innerHTML = value
    }

    get calcDisplay(){
        return this._displayCalcEl.innerHTML
    }

    set calcDisplay(value){
        if(value.toString().length > 10){
            this.setError()
            return false
        }

        this._displayCalcEl.innerHTML = value
    }

    //puxa data atual
    get currentDate(){
        return new Date
    }

}