import express from 'express'
const app=express();

app.use(express.static('HtmlCss'));

app.get('/',(req, res)=>{
    res.sendFile('pagina04.html', {root: 'HtmlCss'})
});

app.listen(3000, () => {
    console.log('Servidor corriendo en perto 3000');
});
