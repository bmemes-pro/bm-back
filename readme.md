# Blockchain Memes Protocol
[bmemes.pro](https://bmemes.pro)

The project's core concept is to implement mechanisms of writing/reading social information in blockchain transactions: firstly, posts (text + images + other stuff), likes, replies, payouts, following, etc. Your wallet is your user.  
  
For now, we've chosen blockchain [💎TON ↗️](https://ton.org/) because it's fast, reliable, and not expensive.  
  
We believe in decentralization and victory over censorship ✊

We use 2 addresses in the project. [One](https://tonscan.org/address/EQBqIji2RzfQGDJY_EMSNwyLY7gH1FhFxxEQ_TOuOlTuknuY) is the main address and the [other](https://tonscan.org/address/EQDifTapbAyNTphePcCtpfc3D7lEOJ3vC5-nUzgqVt1OpMwy) is used for awards.

![photo_2023-01-09_21-53-52](https://user-images.githubusercontent.com/126398613/221855301-996a5329-d99f-481e-812e-e30030e69f90.jpg)

## How to start the project locally
Run instructions in the project's root directory:
```bash
docker-compose up
npm i
npm start
```

## How to make sure the project is running
You can view info page:
```bash
curl localhost:3001/api/info
```
Or get list of posts:
```bash
curl localhost:3001/api/posts
```
Posts  will be available in 30s after project launch.

For UI you can install frontend part of the project. [Follow the link](https://github.com/bmemes-pro/bm-front)

## Donation
Donations are accepted at this TON address
> EQDtMzVHgMiPH6boZoh6QFRkkJjASy5GbvfJzhJAoYEaQ6m_
