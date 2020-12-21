const dinos = [];
let dinoReady = false;

const facts = [
    "weight",
    "height",
    "diet",
    "where",
    "when",
    "fact",
];

// Create Dino Constructor
class Dino {
    species = '';
    weight = 0;
    height = 0;
    diet = '';
    where = '';
    when = '';
    fact = '';
    constructor(data) {
        Object.assign(this, data);
    }
    getImage() {
        return `/images/${this.species.toLowerCase() || 'pigeon'}.png`;
    }

    compareWeight(human) {
        const weight = this.getWeightInKg();
        if (human.weight > weight) {
            return `Weight ${human.weight - weight} kg more`;
        } else if (human.weight < weight) {
            return `Weight ${weight - human.weight} kg less`;
        } else {
            return 'Weight is equals';
        }
    }

    compareHeight(human) {
        const height = this.getHeigtInCm();
        const diffText = (h1, h2) => {
            const diff = h1 - h2;
            const high = Math.floor(diff / 100);
            let res = high + 'm';
            if (diff > high) {
                res += ' ' + Math.floor(diff % 100) + 'cm';
            }
            return res;
        }
        if (human.height > height) {
            return `Height ${diffText(human.height, height)} more`;
        } else if (human.height < height) {
            return `Height ${diffText(height, human.height)} less`;
        } else {
            return 'Height is equals';
        }
    }

    getHeigtInCm() {
        return this.height * 2.54;
    }

    getWeightInKg() {
        return this.weight * 0.453592;
    }

    getTile(fact, human) {
        const div = document.createElement('div');
        div.className = 'grid-item dino-' + this.species.toLowerCase();

        const h3 = document.createElement('h3');
        h3.innerHTML = this.species;
        div.append(h3);

        const img = document.createElement('img');
        img.src = this.getImage();
        img.alt = this.species;

        div.append(img);

        const p = document.createElement('p');

        if (this.species === 'Pigeon') {
            p.innerHTML = this.fact;
        } else {
            switch (fact) {
                case "weight":
                    p.innerHTML = this.compareWeight(human);
                    break;
                case "height":
                    p.innerHTML = this.compareHeight(human);
                    break;
                case "diet":
                    p.innerHTML = 'Diet: ' + this.diet + ' vs ' + human.diet;
                    break;
                case "where":
                    p.innerHTML = 'Living where: ' + this.where;
                    break;
                case "when":
                    p.innerHTML = 'Living when: ' + this.when;
                    break;
                case "fact":
                    p.innerHTML = this.fact;
                    break;
            }
        }
        div.append(p);
       return div;
    }
}

// Create Dino Objects
fetch("./dino.json").then((res) => {

    if (res.status !== 200) {
        console.error('dino fetch error', res.statusText);
        return;
    }

    res.json().then((data) => {

        if (data.Dinos && Array.isArray(data.Dinos)) {

            if (!data.Dinos.length) {
                console.error('empty dinos');
                return;
            }

            data.Dinos.forEach((item) => {
                dinos.push(new Dino(item));
            });
            dinoReady = true;
        } else {
            console.error('error in dinos data');
        }


    }, (err) => {
        console.error('wrong format', err);
    });
}, (err) => {
    console.log('fetch error', err);
});

// Create Human Object
class Human {
    name = '';
    weight = 0;
    height = 0;
    diet = document.getElementById("diet").value.toLowerCase();
    constructor() {
    }
    getImage() {
        return "/images/human.png";
    }
    setData(name, value) {
        this[name] = value;
    }

    getTile() {
        const div = document.createElement('div');
        div.className = 'grid-item human';

        const h3 = document.createElement('h3');
        h3.innerHTML = this.name;
        div.append(h3);

        const img = document.createElement('img');
        img.src = this.getImage();
        img.alt = this.name;
        div.append(img);
        return div;
    }

    check() {
        if (!this.name || this.weight === 0 || this.height === 0) {
            return false;
        }
        return true;
    }
}

const human = new Human();

// Use IIFE to get human data from form
(function getHumanData() {
    document.getElementById("name").addEventListener("change", (element) => {
        human.setData("name", element.target.value);
    });

    document.getElementById("weight").addEventListener("change", (element) => {
        human.setData("weight", parseInt(element.target.value, 10));
    });

    document.getElementById("meters").addEventListener("change", (element) => {
        human.setData("height", (
            parseInt(element.target.value, 10) * 100
            + parseInt(document.getElementById("centimeter").value, 10)) || 0);
    });

    document.getElementById("centimeter").addEventListener("change", (element) => {
        human.setData("height",
            (parseInt(element.target.value, 10) || 0) + (parseInt(document.getElementById("meters").value, 10) || 0) * 100);
    });

    document.getElementById("diet").addEventListener("change", (element) => {
        human.setData("diet", element.target.value);
    });
})();

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

// Generate Tiles for each Dino in Array
document.getElementById('btn').addEventListener('click', () => {

    if (!human.check()) {
        alert('You should fill the form');
        return;
    }

    if (!dinoReady) {
        alert('Dinos are not loaded');
        return;
    }

    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    document.getElementById('dino-compare').style.display = 'none';
    shuffle(dinos).forEach((dino, key) => {

        if (key === 4) {
            grid.append(human.getTile());
        }

        grid.append(dino.getTile(facts[Math.floor(Math.random() * Math.floor(5))], human));
    })

});

// Add tiles to DOM

// Remove form from screen

// On button click, prepare and display infographic
