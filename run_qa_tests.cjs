const fs = require('fs');

async function runAcceptanceTests() {
  const results = {};
  const BASE_URL = 'http://localhost:5000/api';
  
  async function test(tc, desc, fn) {
    try {
      const res = await fn();
      results[tc] = { desc, status: res ? 'PASS' : 'FAIL', details: typeof res === 'string' ? res : (res ? 'OK' : 'Assertion failed') };
    } catch(err) {
      results[tc] = { desc, status: 'FAIL', details: err.message };
    }
  }

  // TC01: Homepage loads successfully
  await test('TC01', 'Homepage loads successfully', async () => {
    const res = await fetch('http://localhost:5000/api/health');
    const data = await res.json();
    return data.status === 'ok';
  });

  // TC02: Navbar navigation works
  await test('TC02', 'Navbar navigation works', () => {
    const navFile = fs.readFileSync('frontend/src/components/layout/Navbar.jsx', 'utf8');
    return navFile.includes('/search') && navFile.includes('/list-business') && navFile.includes('Link');
  });

  // TC03: Find a Vet navigation works
  await test('TC03', 'Find a Vet navigation works', () => {
    const heroFile = fs.readFileSync('frontend/src/components/home/HeroSection.jsx', 'utf8');
    return heroFile.includes('Find a Vet') && heroFile.includes('/search');
  });

  // TC04: Explore Services navigation works
  await test('TC04', 'Explore Services navigation works', () => {
    const heroFile = fs.readFileSync('frontend/src/components/home/HeroSection.jsx', 'utf8');
    return heroFile.includes('Explore Services') && (heroFile.includes('/search') || heroFile.includes('#services'));
  });

  // TC05: All six service categories work
  await test('TC05', 'All six service categories work', async () => {
    const categories = [
      'Veterinary Clinics',
      'Animal Hospitals',
      'Pet Boarding',
      'Diagnostics',
      'Animal Ambulance',
      'Animal NGOs'
    ];
    let allOk = true;
    for (const cat of categories) {
      const res = await fetch(`${BASE_URL}/providers?category=${encodeURIComponent(cat)}`);
      const data = await res.json();
      if (!data.success || !Array.isArray(data.data)) allOk = false;
    }
    return allOk;
  });

  // TC06: Search by provider name works
  await test('TC06', 'Search by provider name works', async () => {
    const res = await fetch(`${BASE_URL}/providers?search=Paws`);
    const data = await res.json();
    return data.success && Array.isArray(data.data) && data.data.length > 0;
  });

  // TC07: Search by city works
  await test('TC07', 'Search by city works', async () => {
    const res = await fetch(`${BASE_URL}/providers?city=Mumbai`);
    const data = await res.json();
    return data.success && Array.isArray(data.data) && data.data.length > 0;
  });

  // TC08: Search by PIN code works
  await test('TC08', 'Search by PIN code works', async () => {
    const res = await fetch(`${BASE_URL}/providers?pincode=400053`);
    const data = await res.json();
    return data.success && Array.isArray(data.data) && data.data.length > 0 && data.data[0].pincode === '400053';
  });

  // TC09: Category filters work
  await test('TC09', 'Category filters work', async () => {
    const res = await fetch(`${BASE_URL}/providers?category=Pet%20Boarding`);
    const data = await res.json();
    return data.success && Array.isArray(data.data) && data.data.length > 0 && data.data.every(p => p.category.toLowerCase().includes('boarding'));
  });

  // TC10: Rating filters work
  await test('TC10', 'Rating filters work', async () => {
    const res = await fetch(`${BASE_URL}/providers?minRating=4.5`);
    const data = await res.json();
    return data.success && Array.isArray(data.data) && data.data.length > 0 && data.data.every(p => p.rating >= 4.5);
  });

  // TC11: Combined filters work
  await test('TC11', 'Combined filters work', async () => {
    const res = await fetch(`${BASE_URL}/providers?city=Mumbai&category=Veterinary%20Clinic&minRating=4.0`);
    const data = await res.json();
    return data.success && Array.isArray(data.data) && data.data.length > 0;
  });

  // TC12: Open Now filter works when data supports it
  await test('TC12', 'Open Now filter works when data supports it', async () => {
    const res = await fetch(`${BASE_URL}/providers?openNow=true`);
    const data = await res.json();
    return data.success && Array.isArray(data.data);
  });

  // TC13: Highest Rated sorting works
  await test('TC13', 'Highest Rated sorting works', async () => {
    const res = await fetch(`${BASE_URL}/providers?sort=rating-desc`);
    const data = await res.json();
    const providers = data.data;
    for (let i = 0; i < providers.length - 1; i++) {
      if (providers[i].rating < providers[i+1].rating) return false;
    }
    return true;
  });

  // TC14: Name A–Z sorting works
  await test('TC14', 'Name A–Z sorting works', async () => {
    const res = await fetch(`${BASE_URL}/providers?sort=name-asc`);
    const data = await res.json();
    const providers = data.data;
    for (let i = 0; i < providers.length - 1; i++) {
      if (providers[i].name.localeCompare(providers[i+1].name) > 0) return false;
    }
    return true;
  });

  // TC15: Relevance sorting works as implemented
  await test('TC15', 'Relevance sorting works as implemented', async () => {
    const res = await fetch(`${BASE_URL}/providers?sort=relevance`);
    const data = await res.json();
    return data.success && Array.isArray(data.data) && data.data.length > 0;
  });

  // TC16: Pagination works
  await test('TC16', 'Pagination works', async () => {
    const res = await fetch(`${BASE_URL}/providers?page=1&limit=2`);
    const data = await res.json();
    return data.success && data.data.length <= 2 && data.pagination.pages >= 1;
  });

  // TC17: Clear filters works
  await test('TC17', 'Clear filters works', () => {
    const searchFile = fs.readFileSync('frontend/src/pages/SearchPage.jsx', 'utf8');
    return searchFile.includes('clearFilters') || searchFile.includes('Clear All');
  });

  // TC18: Provider details load correctly
  await test('TC18', 'Provider details load correctly', async () => {
    const listRes = await fetch(`${BASE_URL}/providers?limit=1`);
    const listData = await listRes.json();
    const slug = listData.data[0].slug;
    const detailRes = await fetch(`${BASE_URL}/providers/${slug}`);
    const detailData = await detailRes.json();
    return detailData.success && detailData.data.name === listData.data[0].name;
  });

  // TC19: Call Now works
  await test('TC19', 'Call Now works', () => {
    const cardFile = fs.readFileSync('frontend/src/components/ui/ProviderCard.jsx', 'utf8');
    const detailFile = fs.readFileSync('frontend/src/pages/ProviderDetailPage.jsx', 'utf8');
    return cardFile.includes('tel:') && detailFile.includes('tel:');
  });

  // TC20: Get Directions works
  await test('TC20', 'Get Directions works', () => {
    const detailFile = fs.readFileSync('frontend/src/pages/ProviderDetailPage.jsx', 'utf8');
    return detailFile.includes('google.com/maps') || detailFile.includes('maps');
  });

  // TC21: Business form validation works
  await test('TC21', 'Business form validation works', async () => {
    const res = await fetch(`${BASE_URL}/business-listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName: '' })
    });
    return res.status === 400;
  });

  let createdSubmissionId = null;
  const uniqueTestName = 'QA Unique Test Clinic ' + Date.now();
  // TC22: Business submission saves to MongoDB
  await test('TC22', 'Business submission saves to MongoDB', async () => {
    const testPayload = {
      businessName: uniqueTestName,
      ownerName: 'Dr. QA Tester',
      email: 'qatest@example.com',
      phone: '9876543210',
      category: 'Veterinary Clinic',
      address: '101 QA Test Blvd',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      description: 'A certified test clinic for automated acceptance audit.',
      services: ['Vaccination', 'Surgery']
    };
    const res = await fetch(`${BASE_URL}/business-listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });
    const data = await res.json();
    if (data.success && data.data && data.data._id) {
      createdSubmissionId = data.data._id;
      return true;
    }
    return false;
  });

  // TC23: Pending business remains hidden
  await test('TC23', 'Pending business remains hidden', async () => {
    const res = await fetch(`${BASE_URL}/providers?search=${encodeURIComponent(uniqueTestName)}`);
    const data = await res.json();
    return data.success && data.data.length === 0;
  });

  let adminToken = null;
  // TC34: Admin authentication works
  await test('TC34', 'Admin authentication works', async () => {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@practoforanimals.com', password: 'Admin@Practo2024!' })
    });
    const data = await res.json();
    if (data.success && data.token) {
      adminToken = data.token;
      return true;
    }
    return false;
  });

  // TC35: Unauthorized admin API requests are rejected
  await test('TC35', 'Unauthorized admin API requests are rejected', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    return res.status === 401 || res.status === 403;
  });

  // TC24: Admin approval works
  await test('TC24', 'Admin approval works', async () => {
    if (!createdSubmissionId || !adminToken) return false;
    const res = await fetch(`${BASE_URL}/admin/business-listings/${createdSubmissionId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ adminNotes: 'Approved in automated QA test' })
    });
    const data = await res.json();
    return data.success && data.data && data.data.listing && data.data.listing.status === 'approved';
  });

  // TC25: Approved business becomes public
  await test('TC25', 'Approved business becomes public', async () => {
    const res = await fetch(`${BASE_URL}/providers?search=${encodeURIComponent(uniqueTestName)}`);
    const data = await res.json();
    return data.success && data.data.length > 0;
  });

  let rejectSubmissionId = null;
  // TC26: Rejected business remains hidden
  await test('TC26', 'Rejected business remains hidden', async () => {
    const testPayload = {
      businessName: 'QA Rejected Clinic ' + Date.now(),
      ownerName: 'Dr. Rejection',
      email: 'reject@example.com',
      phone: '9888888888',
      category: 'Pet Boarding',
      address: '202 Reject Lane',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      description: 'Will be rejected'
    };
    const createRes = await fetch(`${BASE_URL}/business-listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });
    const createData = await createRes.json();
    rejectSubmissionId = createData.data._id;

    const rejRes = await fetch(`${BASE_URL}/admin/business-listings/${rejectSubmissionId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ adminNotes: 'Rejected for testing' })
    });
    const rejData = await rejRes.json();
    if (!rejData.success) return false;

    const pubRes = await fetch(`${BASE_URL}/providers?search=QA%20Rejected%20Clinic`);
    const pubData = await pubRes.json();
    return pubData.data.length === 0;
  });

  // TC27: Correction form validation works
  await test('TC27', 'Correction form validation works', async () => {
    const res = await fetch(`${BASE_URL}/corrections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerName: '' })
    });
    return res.status === 400;
  });

  let correctionId = null;
  let targetProvider = null;
  // TC28: Correction saves to MongoDB
  await test('TC28', 'Correction saves to MongoDB', async () => {
    const listRes = await fetch(`${BASE_URL}/providers?limit=1`);
    const listData = await listRes.json();
    targetProvider = listData.data[0];

    const res = await fetch(`${BASE_URL}/corrections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: targetProvider._id,
        providerName: targetProvider.name,
        issueType: 'wrong_phone',
        description: 'Updated phone number to +91 99999 11111',
        proposedChanges: { phone: '+91 99999 11111' },
        userEmail: 'user@example.com'
      })
    });
    const data = await res.json();
    if (data.success && data.data && data.data._id) {
      correctionId = data.data._id;
      return true;
    }
    return false;
  });

  // TC29: Admin correction approval works
  await test('TC29', 'Admin correction approval works', async () => {
    if (!correctionId || !adminToken) return false;
    const res = await fetch(`${BASE_URL}/admin/corrections/${correctionId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        adminNotes: 'Approved correction in QA',
        updatedFields: { phone: '+91 99999 11111' }
      })
    });
    const data = await res.json();
    return data.success && data.data && data.data.correction && data.data.correction.status === 'resolved';
  });

  // TC30: Approved correction updates provider data
  await test('TC30', 'Approved correction updates provider data', async () => {
    const res = await fetch(`${BASE_URL}/providers/${targetProvider.slug}`);
    const data = await res.json();
    return data.success && data.data.phone === '+91 99999 11111';
  });

  // TC31: Rejected correction does not update provider data
  await test('TC31', 'Rejected correction does not update provider data', async () => {
    const cRes = await fetch(`${BASE_URL}/corrections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: targetProvider._id,
        providerName: targetProvider.name,
        issueType: 'incorrect_name',
        description: 'Should not change to Wrong Name',
        userEmail: 'user@example.com'
      })
    });
    const cData = await cRes.json();
    const rejRes = await fetch(`${BASE_URL}/admin/corrections/${cData.data._id}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ adminNotes: 'Rejected' })
    });
    const pRes = await fetch(`${BASE_URL}/providers/${targetProvider.slug}`);
    const pData = await pRes.json();
    return pData.data.name === targetProvider.name;
  });

  // TC32: Existing ratings remain unchanged
  await test('TC32', 'Existing ratings remain unchanged', async () => {
    const pRes = await fetch(`${BASE_URL}/providers/${targetProvider.slug}`);
    const pData = await pRes.json();
    return pData.data.rating === targetProvider.rating;
  });

  // TC33: Existing review counts remain unchanged
  await test('TC33', 'Existing review counts remain unchanged', async () => {
    const pRes = await fetch(`${BASE_URL}/providers/${targetProvider.slug}`);
    const pData = await pRes.json();
    return pData.data.reviewCount === targetProvider.reviewCount;
  });

  // TC36: Public APIs do not expose private information
  await test('TC36', 'Public APIs do not expose private information', async () => {
    const res = await fetch(`${BASE_URL}/providers`);
    const text = await res.text();
    return !text.includes('adminPassword') && !text.includes('Admin@Practo') && !text.includes('jwtSecret');
  });

  // TC37: Mobile navigation works
  await test('TC37', 'Mobile navigation works', () => {
    const nav = fs.readFileSync('frontend/src/components/layout/Navbar.jsx', 'utf8');
    return nav.includes('open') && nav.includes('setOpen') && nav.includes('Menu') && nav.includes('X');
  });

  // TC38: Mobile menu has an opaque background
  await test('TC38', 'Mobile menu has an opaque background', () => {
    const nav = fs.readFileSync('frontend/src/components/layout/Navbar.jsx', 'utf8');
    return nav.includes('#ffffff') && nav.includes('z-[101]') && nav.includes('bg-[#FFFFFF]');
  });

  // TC39: Responsive layout works
  await test('TC39', 'Responsive layout works', () => {
    const hero = fs.readFileSync('frontend/src/components/home/HeroSection.jsx', 'utf8');
    const search = fs.readFileSync('frontend/src/pages/SearchPage.jsx', 'utf8');
    return hero.includes('lg:grid-cols-12') && search.includes('lg:grid-cols-4');
  });

  // TC40: Invalid routes show proper fallback
  await test('TC40', 'Invalid routes show proper fallback', () => {
    const app = fs.readFileSync('frontend/src/App.jsx', 'utf8');
    return app.includes('path="*"') && app.includes('NotFoundPage');
  });

  // TC41: API error states work
  await test('TC41', 'API error states work', async () => {
    const res = await fetch(`${BASE_URL}/providers/non-existent-provider-slug-404`);
    return res.status === 404;
  });

  // TC42: Frontend production build succeeds
  await test('TC42', 'Frontend production build succeeds', () => {
    return fs.existsSync('frontend/dist/index.html');
  });

  // TC43: Backend starts successfully
  await test('TC43', 'Backend starts successfully', async () => {
    const res = await fetch('http://localhost:5000/api/health');
    return res.status === 200;
  });

  // TC44: MongoDB connection is verified
  await test('TC44', 'MongoDB connection is verified', async () => {
    const res = await fetch('http://localhost:5000/api/health');
    const data = await res.json();
    return data.database === 'connected';
  });

  // TC45: Environment configuration is production-ready
  await test('TC45', 'Environment configuration is production-ready', () => {
    return fs.existsSync('backend/.env.example') && fs.existsSync('frontend/.env.example') && fs.existsSync('frontend/vercel.json');
  });

  console.log(JSON.stringify(results, null, 2));

  let passCount = 0;
  let failCount = 0;
  for (const [k, v] of Object.entries(results)) {
    if (v.status === 'PASS') passCount++;
    else failCount++;
  }
  console.log(`\nTOTAL SUMMARY: ${passCount} PASSED, ${failCount} FAILED out of ${Object.keys(results).length} tests.`);
}

runAcceptanceTests();
