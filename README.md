### Hexlet tests and linter status:
[![Actions Status](https://github.com/MayukAA/frontend-project-11/workflows/hexlet-check/badge.svg)](https://github.com/MayukAA/frontend-project-11/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/81e365ca508debf7b37a/maintainability)](https://codeclimate.com/github/MayukAA/frontend-project-11/maintainability)
[![build-rss-reader](https://github.com/MayukAA/frontend-project-11/actions/workflows/build-rss-reader.yml/badge.svg)](https://github.com/MayukAA/frontend-project-11/actions/workflows/build-rss-reader.yml)

`Наставнику: (после правок удалю этот фрагмент)`
`Здравствуйте! С большой опаской отправляю Вам этот проект)`

`Из-за бытовых обстоятельств выполнял проект с перерывами, вплоть до нескольких недель. Это вносило дополнительную сложность. Почти наверняка в моем коде достаточно всяких костыльных решений и некорректных именований: я писал их, чтобы работало хоть как-то, потом наступал перерыв, после которого я брался за следующие шаги проекта, забыв поправить предыдущие.`

`Перед отправкой на проверку я, как смог, отрефакторил код. Но, чувствую, что уже "глаз замылился".`

`Знаю, что у меня некорректно (не так, как в демонстрационном проекте) отображается добавление новых постов по ссылке: http://lorem-rss.herokuapp.com/feed?unit=second&interval=5. Не понимаю из-за чего это, поэтому не смог исправить. Возможно, дело в функции 'addNewPosts()' - она выглядит кошмарно, за нее мне стыдно больше всего!)`

`Тестировал свой и демонстационный проект на реальных РСС-рассылках: открывал несколько одних и тех же рассылок у себя и в дем. проекте и оставлял на некоторое время. В этих случаях новые посты добавлялись и отображались нормально.`

`Спасибо!`

<h1 align="center">RSS Reader</h1>

### Description

[RSS-Reader](https://frontend-project-11-mayukaa.vercel.app/) is a service for aggregating RSS feeds, with the help of which it is convenient to read a variety of sources, such as blogs. It allows you to add an unlimited number of RSS feeds, updates them itself and adds new entries to the common stream.

### Usage

Follow this [link](https://frontend-project-11-mayukaa.vercel.app/).

### Installation for Developers

**Minimum requirements**: installed [Node.js](https://nodejs.org/en/).

1. In the command line terminal, navigate to the directory where the game will be installed;
2. Clone the repository: `git clone git@github.com:MayukAA/frontend-project-11.git`;
3. Install project dependencies: `make install`;
4. Start the local server: `make develop`;
5. Build the application for production: `make build`.
