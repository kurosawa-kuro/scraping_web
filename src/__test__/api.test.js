const { fetchCategories } = require('../lib/api'); // Adjust the path to your actual file

describe('fetchCategories', () => {
    it('fetches categories successfully', async () => {
        // Act
        const categories = await fetchCategories();

        // Assert
        expect(Array.isArray(categories)).toBeTruthy();
        // You can also check for the length if you know how many categories there should be:
        // expect(categories).toHaveLength(expectedNumberOfCategories);
        // Or check for specific properties:
        categories.forEach(category => {
            expect(category).toHaveProperty('id');
            expect(category).toHaveProperty('title');
        });
    });
});
