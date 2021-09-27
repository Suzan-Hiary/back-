const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT

const mongoose = require('mongoose');

mongoose.connect('mongodb://Suzan:1234@cluster0-shard-00-00.nhjbu.mongodb.net:27017,cluster0-shard-00-01.nhjbu.mongodb.net:27017,cluster0-shard-00-02.nhjbu.mongodb.net:27017/test?ssl=true&replicaSet=atlas-9b55li-shard-0&authSource=admin&retryWrites=true&w=majority');


const FlowerSchema = new mongoose.Schema({
    name: String,
    photo: String
})

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, require: true },
    flowers: [FlowerSchema]
})

const UserModal = mongoose.model('flower', UserSchema)

const seedfunction = () => {
    let suzan = new UserModal({
        email: 'suzanhiary4@gmail.com',
        flowers: [
            {
                "instructions": "Blooms continuously from early spring to first frost. Full sun or part shade, moist well-drained soil.",
                "photo": "https://search.shelmerdine.com/Content/Images/Photos/G700-01.jpg",
                "name": "Calibrachoa Noa"
            },
            {
                "instructions": "Choose the brightest windows in your house for your orchids, place on an humidity tray and spray regularly.",
                "photo": "https://www.images.orchid-idea.com/product/500X500/i_3443288.jpg",
                "name": "Phalaenopsis Purple"
            },

        ]
    })
    suzan.save().then(() => console.log('done')).catch(() => console.log('twice'))
}
seedfunction();


const getallflower = (req, res) => {
    axios.get('https://flowers-api-13.herokuapp.com/getFlowers')
        .then(response => {
            res.send(response.data)
        })
}


const getfavlist = (req, res) => {

    let email = req.params.email

    UserModal.findOne({ email: email }, (err, doc) => {
        if (err) {
            res.send(error.message)
        } else {
            res.send(doc)
        }
    })
}
const posttofav = (req, res) => {
    let { name, photo } = req.body
    let email = req.params.email

    UserModal.findOne({ email: email }, (err, item) => {
        item.flowers.push({
            name: name,
            photo: photo
        })
        item.save();
        res.send(item)
    })

}

const deletefav = (req, res) => {
    let email = req.params.email;
    let id = req.params.id;
    UserModal.findOne({ email: email }, (err, item) => {
        item.flowers.splice(id, 1)
        item.save();
        res.send(item)
    })

}
const updatefav = (req, res) => {
    let id = req.params.id;
    let { name, photo } = req.body
    let data = {
        name: name,
        photo: photo
    }
    console.log(data)
    UserModal.findOne({ id: id }, (err, item) => {
        item.flowers.splice(id, 1, data)
        item.save()
        res.send(item)
    })
}

app.get('/flower', getallflower);
app.get('/favlist/:email', getfavlist);
app.post('/favlist/:email', posttofav);
app.delete('/delete/:email/:id', deletefav);
app.put('/update/:id', updatefav)

app.listen(PORT, () => {
    console.log(`${PORT}`)
})