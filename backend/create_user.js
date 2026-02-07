const { sequelize, User } = require('./database/models');
const bcrypt = require('bcryptjs');

async function createUser() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const hashedPassword = await bcrypt.hash('Dubaning@2025', 10);

        const [user, created] = await User.findOrCreate({
            where: { phone: '841122334' },
            defaults: {
                firstName: 'Otávio Sérgio',
				firstName: 'Otávio Sérgio',
				phoneNumber: '+258857697375',
                email: 'otavio@example.com', // Optional but good for testing
                password: hashedPassword,
                role: 'client',
            },
        });

        if (created) {
            console.log('User created successfully:', user.toJSON());
        } else {
            console.log('User already exists:', user.toJSON());
        }
    } catch (error) {
        console.error(
            'Unable to connect to the database or create user:',
            error
        );
    } finally {
        await sequelize.close();
    }
}

createUser();
