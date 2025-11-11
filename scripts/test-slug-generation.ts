import { createSlug, generateUniqueRanchSlug } from '../lib/slugify';

async function testSlugGeneration() {
  console.log('🧪 Testing Slug Generation\n');

  // Test 1: Basic slug generation
  console.log('📝 Test 1: Basic slug generation');
  const tests = [
    'Demo Ranch',
    'Smith & Sons Ranch',
    'ABC-123 Ranch',
    'Ranch  With   Spaces',
    'UPPERCASE RANCH',
    'Special!@#$%Characters',
  ];

  tests.forEach(name => {
    const slug = createSlug(name);
    console.log(`   "${name}" → "${slug}"`);
  });

  // Test 2: Unique slug generation
  console.log('\n📝 Test 2: Unique slug generation (with existing "demo-ranch")');
  const uniqueSlug1 = await generateUniqueRanchSlug('Demo Ranch');
  console.log(`   "Demo Ranch" → "${uniqueSlug1}" (should be demo-ranch-2)`);

  const uniqueSlug2 = await generateUniqueRanchSlug('New Ranch Name');
  console.log(`   "New Ranch Name" → "${uniqueSlug2}" (should be new-ranch-name)`);

  console.log('\n✅ Slug generation tests completed!');
}

testSlugGeneration()
  .catch(console.error);
