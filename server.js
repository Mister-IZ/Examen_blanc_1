import express from 'express';
import Tv_List from './Models/Tele.js';


const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  // Renvoyer la page d'accueil avec la vidéo
  res.render('Acceuil.ejs');
});

app.get("/contenu", async function (req, res) {
    const wishList = await Tv_List.loadMany({Acheter : 0}); // si désirer c pas acheter
    const ownedList = await Tv_List.loadMany({Acheter : 1}); // c acheter 
    const breakList = await Tv_List.loadMany({Fonctionnel : 0}); // c plus fonctionnel
    res.render('TV.ejs', { wishList, ownedList, breakList});
  });

app.post("/add", async function (req, res){
    const newligne = new Tv_List();
    newligne.Marque = req.body.Marque
    newligne.Prix = req.body.Prix
    newligne.Taille = req.body.Taille
    newligne.Acheter = 0
    await newligne.save();
    res.redirect("/contenu")
})


app.get("/delete/:id", async function (req, res) {
  await Tv_List.delete({ idtv: req.params.id });
  res.redirect('/contenu');
});

app.get("/bought/:id", async function (req, res) {
    console.log(req.params.id);
    const teve = await Tv_List.load({idtv:parseInt(req.params.id)});
    teve.Acheter = 1;
    teve.Fonctionnel = 1;
    await teve.save();
    res.redirect("/contenu");
})

app.post("/break/:id", async function (req, res) {
    console.log(req.params.id);
    const televi = await Tv_List.load({idtv:parseInt(req.params.id)});
    televi.Acheter = 0;
    televi.Fonctionnel = 0;
    console.log(req.body.cause)
    televi.Cause = req.body.cause ? req.body.cause : null;
    await televi.save();
    res.redirect("/contenu");
})




app.listen(4000);