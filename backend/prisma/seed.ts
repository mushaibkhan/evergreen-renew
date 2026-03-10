import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Categories
    const catMobiles = await prisma.category.upsert({
        where: { slug: 'mobiles' },
        update: {},
        create: { name: 'Mobiles', slug: 'mobiles', description: 'Sell your old smartphones' },
    });

    const catLaptops = await prisma.category.upsert({
        where: { slug: 'laptops' },
        update: {},
        create: { name: 'Laptops', slug: 'laptops', description: 'Sell your old laptops' },
    });

    const catTvs = await prisma.category.upsert({
        where: { slug: 'televisions' },
        update: {},
        create: { name: 'Televisions', slug: 'televisions', description: 'Sell your old TVs' },
    });

    const catAppliances = await prisma.category.upsert({
        where: { slug: 'appliances' },
        update: {},
        create: { name: 'Appliances', slug: 'appliances', description: 'Sell washing machines, ACs, etc.' },
    });

    // Brands
    const apple = await prisma.brand.upsert({
        where: { slug: 'apple' },
        update: {},
        create: { name: 'Apple', slug: 'apple', categoryId: catMobiles.id },
    });

    const samsung = await prisma.brand.upsert({
        where: { slug: 'samsung' },
        update: {},
        create: { name: 'Samsung', slug: 'samsung', categoryId: catMobiles.id },
    });

    const oneplus = await prisma.brand.upsert({
        where: { slug: 'oneplus' },
        update: {},
        create: { name: 'OnePlus', slug: 'oneplus', categoryId: catMobiles.id },
    });

    const dell = await prisma.brand.upsert({
        where: { slug: 'dell' },
        update: {},
        create: { name: 'Dell', slug: 'dell', categoryId: catLaptops.id },
    });

    const hp = await prisma.brand.upsert({
        where: { slug: 'hp' },
        update: {},
        create: { name: 'HP', slug: 'hp', categoryId: catLaptops.id },
    });

    // Devices
    await prisma.device.upsert({
        where: { slug: 'iphone-15-128gb' },
        update: {},
        create: { name: 'iPhone 15 128GB', slug: 'iphone-15-128gb', basePrice: 45000, categoryId: catMobiles.id, brandId: apple.id },
    });

    await prisma.device.upsert({
        where: { slug: 'iphone-14-128gb' },
        update: {},
        create: { name: 'iPhone 14 128GB', slug: 'iphone-14-128gb', basePrice: 35000, categoryId: catMobiles.id, brandId: apple.id },
    });

    await prisma.device.upsert({
        where: { slug: 'iphone-13-128gb' },
        update: {},
        create: { name: 'iPhone 13 128GB', slug: 'iphone-13-128gb', basePrice: 27000, categoryId: catMobiles.id, brandId: apple.id },
    });

    await prisma.device.upsert({
        where: { slug: 'samsung-s24-ultra' },
        update: {},
        create: { name: 'Samsung S24 Ultra', slug: 'samsung-s24-ultra', basePrice: 55000, categoryId: catMobiles.id, brandId: samsung.id },
    });

    await prisma.device.upsert({
        where: { slug: 'samsung-s23' },
        update: {},
        create: { name: 'Samsung Galaxy S23', slug: 'samsung-s23', basePrice: 30000, categoryId: catMobiles.id, brandId: samsung.id },
    });

    await prisma.device.upsert({
        where: { slug: 'oneplus-12' },
        update: {},
        create: { name: 'OnePlus 12', slug: 'oneplus-12', basePrice: 32000, categoryId: catMobiles.id, brandId: oneplus.id },
    });

    await prisma.device.upsert({
        where: { slug: 'dell-inspiron-15' },
        update: {},
        create: { name: 'Dell Inspiron 15', slug: 'dell-inspiron-15', basePrice: 22000, categoryId: catLaptops.id, brandId: dell.id },
    });

    await prisma.device.upsert({
        where: { slug: 'hp-pavilion-14' },
        update: {},
        create: { name: 'HP Pavilion 14', slug: 'hp-pavilion-14', basePrice: 18000, categoryId: catLaptops.id, brandId: hp.id },
    });

    // Questionnaire for Mobiles
    const mobileQ = await prisma.questionnaire.create({
        data: {
            categoryId: catMobiles.id,
            questions: {
                create: [
                    {
                        text: 'Does your device switch on?',
                        type: 'YES_NO',
                        options: {
                            create: [
                                { label: 'Yes', priceDeduction: 0 },
                                { label: 'No', priceDeduction: 10000 },
                            ],
                        },
                    },
                    {
                        text: 'Are there any scratches on the screen?',
                        type: 'MULTIPLE_CHOICE',
                        options: {
                            create: [
                                { label: 'Flawless', priceDeduction: 0 },
                                { label: 'Minor Scratches', priceDeduction: 1500 },
                                { label: 'Heavy Scratches / Cracked', priceDeduction: 4500 },
                            ],
                        },
                    },
                    {
                        text: 'Is the back panel damaged?',
                        type: 'MULTIPLE_CHOICE',
                        options: {
                            create: [
                                { label: 'No Damage', priceDeduction: 0 },
                                { label: 'Minor Dents', priceDeduction: 800 },
                                { label: 'Cracked Back', priceDeduction: 2500 },
                            ],
                        },
                    },
                    {
                        text: 'Battery health?',
                        type: 'MULTIPLE_CHOICE',
                        options: {
                            create: [
                                { label: 'Above 80%', priceDeduction: 0 },
                                { label: '60-80%', priceDeduction: 1000 },
                                { label: 'Below 60%', priceDeduction: 3000 },
                            ],
                        },
                    },
                    {
                        text: 'Do all buttons and ports work?',
                        type: 'YES_NO',
                        options: {
                            create: [
                                { label: 'Yes', priceDeduction: 0 },
                                { label: 'No', priceDeduction: 2000 },
                            ],
                        },
                    },
                ],
            },
        },
    });

    // Questionnaire for Laptops
    await prisma.questionnaire.create({
        data: {
            categoryId: catLaptops.id,
            questions: {
                create: [
                    {
                        text: 'Does the laptop power on?',
                        type: 'YES_NO',
                        options: {
                            create: [
                                { label: 'Yes', priceDeduction: 0 },
                                { label: 'No', priceDeduction: 8000 },
                            ],
                        },
                    },
                    {
                        text: 'Screen condition?',
                        type: 'MULTIPLE_CHOICE',
                        options: {
                            create: [
                                { label: 'Perfect', priceDeduction: 0 },
                                { label: 'Minor Issues (dead pixels, light scratches)', priceDeduction: 2000 },
                                { label: 'Cracked / Defective', priceDeduction: 5000 },
                            ],
                        },
                    },
                    {
                        text: 'Keyboard condition?',
                        type: 'MULTIPLE_CHOICE',
                        options: {
                            create: [
                                { label: 'Fully Working', priceDeduction: 0 },
                                { label: 'Some keys not working', priceDeduction: 1500 },
                            ],
                        },
                    },
                ],
            },
        },
    });

    console.log('✅ Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
