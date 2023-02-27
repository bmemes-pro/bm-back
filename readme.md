# Blockchain Memes Protocol
The project's core concept is to implement mechanisms of writing/reading social information in blockchain transactions: firstly, posts (text + images + other stuff), likes, replies, payouts, following, etc. Your wallet is your user.  
  
For now, we've chosen blockchain [💎TON ↗️](https://ton.org/) because it's fast, reliable, and not expensive.  
  
We believe in decentralization and victory over censorship ✊

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
For UI you can install frontend part of the project. [Follow the link](https://github.com/bmemes-pro/bm-front)
