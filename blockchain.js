const crypto = require('crypto');

class Blockchain {

    constructor() {
        // create chain and transaction
        this.chain = [];
        this.current_transactions = [];

        // Binding of 'this'
        this.newBlock = this.newBlock.bind(this);
        this.newTransaction = this.newTransaction.bind(this);
        this.lastBlock = this.lastBlock.bind(this);
        this.proofOfWork = this.proofOfWork.bind(this);
    }

    /* create a new block */
    newBlock(proof, previousHash) {
        const block = {
            index: this.chain.length + 1,
            timestamp: new Date(),
            transactions: this.current_transactions,
            proof,
            previousHash
        };
        this.current_transactions = [];
        this.chain.push(block);
        return block;
    }

    /* store a new transaction */
    newTransaction(sender, recipient, amount) {
        this.current_transactions.push({
            sender,
            recipient,
            amount
        });
        return this.lastBlock()['index'] + 1;
    }

    /* hash the block */
    hash(block) {
        return crypto.createHmac(process.env.HASH_TYPE, process.env.CRYPTO_SECRET)
            .update(JSON.stringify(block))
            .digest('hex');
    }

    /* return the last block of the chain */
    lastBlock() {
        return this.chain.pop();
    }

    /* validate pow */
    validProof(lastProof, proof) {
        const guessHash = crypto.createHmac(process.env.HASH_TYPE, process.env.CRYPTO_SECRET)
            .update(`${lastProof}${proof}`)
            .digest('hex');
        return guessHash.substr(0, 5) === process.env.RESOLUTION_HASH;
    }

    proofOfWorw(lastProof) {
        let proof = 0;
        while (true) {
            if (!this.validProof(lastProof, proof)) {
                proof++;
            } else {
                break;
            }
        }
        return proof;
    }
}

module.exports = Blockchain;