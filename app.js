const dinos = [];
let dinoReady = false;

const facts = [
    'weight',
    'height',
    'diet',
    'where',
    'when',
    'fact',
];

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

    /**
     * @description - Represents weights comparison
     * @constructor
     * @param human - object human
     * @returns - Returns result of comparison of the weight between the object human and object dino converted to kg
     */
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

    /**
     * @description - Represents heights comparison
     * @constructor
     * @param human - object human
     * @returns - Returns result of comparison of the height between the object human and object dino
     */
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
            return 'Height is equal';
        }
    }

    /**
     * @description - Represents diet comparison
     * @constructor
     * @param human - object human
     * @returns - Returns result of comparison of the diet between the object human and object dino
     */
    compareDiet(human) {
        console.log(this.diet, human.diet);
        if (this.diet === human.diet) {
            return 'Diet is equal';
        } else {
            return 'Diet: ' + this.diet + ' vs ' + human.diet;
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
        p.innerHTML = this.getFactText(fact, human);

        div.append(p);
        return div;
    }

    getFactText(fact, human) {
        if (this.species === 'Pigeon') {
            return this.fact;
        } else {
            switch (fact) {
                case 'weight':
                    return this.compareWeight(human);
                case 'height':
                    return this.compareHeight(human);
                case 'diet':
                    return this.compareDiet(human);
                case 'where':
                    return 'Living where: ' + this.where;
                case 'when':
                    return 'Living when: ' + this.when;
                default:
                    return this.fact;
            }
        }
    }
}

fetch('./dino.json').then((res) => {

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

/**
 * @description - Represents class Human with methods getImage to have the image, setData to set the values into the class and getTile to set the human tile in the middle
 * @constructor
 * @param
 * @returns
 */
class Human {
    name = '';
    weight = 0;
    height = 0;
    diet = document.getElementById('diet').value.toLowerCase();
    constructor() {}
    getImage() {
        return '/images/human.png';
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

/**
  * @description - Represents collected data from the form
  * @constructor
  * @param
  * @returns - collects the data from the form and adds to the object to use for comparison
  */
(function getHumanData() {
    document.getElementById('name').addEventListener('change', (element) => {
        human.setData('name', element.target.value);
    });

    document.getElementById('weight').addEventListener('change', (element) => {
        human.setData('weight', parseInt(element.target.value, 10));
    });

    document.getElementById('meters').addEventListener('change', (element) => {
        human.setData('height', (
            parseInt(element.target.value, 10) * 100 +
            parseInt(document.getElementById('centimeter').value, 10)) || 0);
    });

    document.getElementById('centimeter').addEventListener('change', (element) => {
        human.setData('height',
            (parseInt(element.target.value, 10) || 0) + (parseInt(document.getElementById('meters').value, 10) || 0) * 100);
    });

    document.getElementById('diet').addEventListener('change', (element) => {
        human.setData('diet', element.target.value.toLowerCase());
    });
})();

function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

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
    document.getElementById('btn-again').style.display = 'inline-block';
    shuffle(dinos).forEach((dino, key) => {

        if (key === 4) {
            grid.append(human.getTile());
        }
        grid.append(dino.getTile(facts[Math.floor(Math.random() * Math.floor(5))], human));
    })

});

document.getElementById('btn-again').addEventListener('click', () => {
    document.getElementById('dino-compare').style.display = 'inline-block';
    document.getElementById('btn-again').style.display = 'none';
    grid.innerHTML = '';
});
