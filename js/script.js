'use strict';
window.addEventListener('load', () => {
    const loader = () => {
        const loadWraper = document.querySelector('.loader-wrap');

        setTimeout(() => {
            loadWraper.classList.add('loaded');

            setTimeout(() => {
                loadWraper.remove();
            }, 1500);
        }, 1500);
    };
    loader();
});

window.addEventListener('DOMContentLoaded', () => {
    const getData = () => fetch('./dbHeroes.json');

    const addCard = data => {
        const selectCurrent = document.querySelector('.select__current'),
            cardWraper = document.querySelector('.cards');

        cardWraper.innerHTML = '';

        const newData = data.filter(item => {
            if (item.movies && item.movies.includes(selectCurrent.textContent)) {
                return item;
            }
        });

        const addCardFun = elem => {
            elem.forEach(item => {
                let films = item.movies ? item.movies.join(', ') : '';
                cardWraper.insertAdjacentHTML(
                    'afterbegin',
                    `
<div class="card-wrap">
    <div class="card">
    <div class="front" style="background-image: url('${item.photo}')">
    <h3 class="card__title">${item.name}</h3>
    </div>
    <div class="back" style="background-image: url('${item.photo}')">
        <div class="back-wrap">
        <a href="${item.link}" target="_blank" rel="nofollow noopener"><h2>${item.name}</h2></a>
        ${item.realName ? `<span><b>Real name:</b> 
        ${item.realName}</span>` : ''}

        ${item.species ?  `<span><b>Species:</b>
        ${item.species}</span>` : '' }

        ${ item.citizenship ? `<span><b>Citizenship:</b> 
        ${item.citizenship}</span>` : ''}

        <span><b>Gender:</b> ${item.gender}</span>

        ${item.birthDay ? `<span><b>Birth day:</b>
        ${item.birthDay}</span>` : '' }

        ${item.deathDay ? ` <span><b>Death day:</b>
        ${item.deathDay}</span>` : ''}

        <span><b>Status:</b> ${item.status}</span>
        <span><b>Actors:</b> ${item.actors}</span>
        
        <br>
        <b>Movies:</b>
        <span>${films ? films : 'Not entered into KVM'}</span>
        </div>
    </div>
    </div>
</div>
`
                );
            });
        };

        if (selectCurrent.textContent === 'List of films' || selectCurrent.textContent === 'All films') {
            addCardFun(data);
        } else {
            addCardFun(newData);
        }
    };

    const customSelect = () => {
        const selectHeader = document.querySelector('.select__header'),
            selectItem = document.querySelectorAll('.select__item'),
            selectBtn = document.querySelector('.select__btn'),
            select = document.querySelector('.select');

        const remove = () => {
            select.classList.remove('is-active');
            selectBtn.classList.remove('select__btn_active');
        };

        const selectToggle = () => {
            select.classList.toggle('is-active');
            selectBtn.classList.toggle('select__btn_active');
        };

        const selectChoose = event => {
            const target = event.target;
            const text = target.textContent,
                currentText = select.querySelector('.select__current');
            currentText.textContent = text;
            remove();
            getData()
                .then(response => response.json())
                .then(data => {
                    addCard(data);
                })
                .catch(err => console.log(err));
        };

        selectHeader.addEventListener('click', selectToggle);

        document.addEventListener('click', event => {
            const target = event.target;

            if (!target.closest('.select') && select.classList.contains('is-active')) {
                remove();
            }
        });
        selectItem.forEach(item => {
            item.addEventListener('click', selectChoose);
        });
    };

    const addToSelect = data => {
        const selectBody = document.querySelector('.select__body');
        const moviesData = [];

        data.filter(item => {
            if (item.movies) {
                moviesData.push(...item.movies);
            }
        });

        const allMovies = [...new Set(moviesData)];

        allMovies.forEach(item => {
            selectBody.insertAdjacentHTML(
                'afterbegin',
                `
<div class="select__item">${item}</div>
`
            );
        });
        selectBody.insertAdjacentHTML(
            'afterbegin',
            `
<div class="select__item">All films</div>
`
        );
    };

    getData()
        .then(response => response.json())
        .then(data => {
            addToSelect(data);
            customSelect();
            addCard(data);
        })
        .catch(err => console.log(err));
    
    document.querySelector('body').addEventListener('mousemove', e => {
        const stars = document.querySelector('.stars');
        let x = e.clientX / window.innerWidth;
        let y = e.clientY / window.innerHeight;
        stars.style.transform = 'translate(-' + x * 50 + 'px, -' + y * 50 + 'px)';
    });
});