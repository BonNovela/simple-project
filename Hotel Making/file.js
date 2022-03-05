function submitButton(){
    const inputTxt = document.querySelector('.inpuTxt').value;
    const inputEmail = document.querySelector('.inputEmail').value;
    const inputNumber = document.querySelector('.inputNumber').value;
    const inputMsg = document.querySelector('.inputMsg').value;

    const data =[];
    data.push(inputTxt)
    data.push(inputEmail)
    data.push(inputNumber)
    data.push(inputMsg)

    const data_string = JSON.stringify(data);

    const file = new Blob([data_string], {type: 'text'});

    const anchor = document.createElement('e');
    anchor.href = URL.createObjectURL(file);
    anchor.download = ('save.text')
    alert('Welcome To Hotel')
    anchor.click();

}