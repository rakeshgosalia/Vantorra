const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Mobile navigation
const menuBtn = $('.menu-toggle'), mobileMenu = $('[data-mobile-menu]');
menuBtn?.addEventListener('click', () => { const open = mobileMenu.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open); menuBtn.innerHTML = `<i class="ph ph-${open ? 'x' : 'list'}"></i>` });
$$('.mobile-menu a').forEach(a => a.addEventListener('click', () => { mobileMenu.classList.remove('open'); menuBtn?.setAttribute('aria-expanded', 'false'); if (menuBtn) menuBtn.innerHTML = '<i class="ph ph-list"></i>' }));

// Product image gallery
const heroImage = $('#heroImage');
$$('.thumb').forEach(btn => btn.addEventListener('click', () => { if (!heroImage) return; $$('.thumb').forEach(b => b.classList.remove('active')); btn.classList.add('active'); heroImage.style.opacity = '.2'; heroImage.style.transform = 'scale(.985)'; setTimeout(() => { heroImage.src = btn.dataset.image; heroImage.onload = () => { heroImage.style.opacity = '1'; heroImage.style.transform = 'scale(1)' } }, 140) }));

// Scroll reveals
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target) } }), { threshold: .12 });
$$('.reveal').forEach(el => revealObserver.observe(el));

// Animated stats
const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; const el = entry.target, end = Number(el.dataset.counter), start = performance.now(), duration = 900; const tick = now => { const p = Math.min((now - start) / duration, 1), eased = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(end * eased); if (p < 1) requestAnimationFrame(tick) }; requestAnimationFrame(tick); counterObserver.unobserve(el) }), { threshold: .6 });
$$('[data-counter]').forEach(el => counterObserver.observe(el));

// Sticky cart after hero
const sticky = $('[data-sticky-cart]'), hero = $('.hero');
const stickyObserver = new IntersectionObserver(([entry]) => sticky?.classList.toggle('visible', !entry.isIntersecting), { threshold: .08 });
if (hero) stickyObserver.observe(hero);

// Demo add-to-cart feedback
const toast = $('[data-toast]'); let toastTimer;
$$('[data-add-cart]').forEach(btn => btn.addEventListener('click', () => { clearTimeout(toastTimer); toast?.classList.add('show'); toastTimer = setTimeout(() => toast?.classList.remove('show'), 2200) }));

// Close open FAQ icon behavior is handled with CSS; keep one FAQ open at a time.
const faqDetails = $$('.faq details');
faqDetails.forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) {
        faqDetails.forEach(other => { if (other !== detail) other.open = false; });
    } else if (!faqDetails.some(other => other.open)) {
        detail.open = true;
    }
}));

// Product setup and quantity selector
const setupCards = $$('[data-setup]');
const quantityOutput = $('[data-quantity]');
const productPrice = $('[data-product-price]');
const productWas = $('.price-row del');
const productSave = $('.price-row .save-pill');
const optionSave = $('[data-option-save]');
const productAdd = $('[data-product-add] span');
const stickyName = $('[data-sticky-name]');
const stickyPrice = $('[data-sticky-price]');
const stickyQuantity = $('[data-sticky-quantity]');
let selectedSetup = setupCards.find(card => card.classList.contains('active'));
let quantity = 1;

const updatePurchasePanel = () => {
    if (!selectedSetup) return;
    const price = Number(selectedSetup.dataset.price);
    const name = selectedSetup.dataset.setup;
    if (quantityOutput) quantityOutput.textContent = quantity;
    if (productPrice) productPrice.textContent = `$${(price * quantity).toFixed(2)}`;
    if (productWas) productWas.textContent = `$${(Number(selectedSetup.dataset.was) * quantity).toFixed(2)}`;
    if (productSave) productSave.textContent = selectedSetup.dataset.save;
    if (optionSave) optionSave.textContent = selectedSetup.dataset.save;
    if (productAdd) productAdd.textContent = `Add ${quantity > 1 ? `${quantity} × ` : ''}${name} — $${price * quantity}`;
    if (stickyName) stickyName.textContent = name;
    if (stickyPrice) stickyPrice.textContent = `$${(price * quantity).toFixed(2)}`;
    if (stickyQuantity) stickyQuantity.textContent = quantity;
};
setupCards.forEach(card => card.addEventListener('click', () => {
    selectedSetup = card;
    setupCards.forEach(option => {
        const active = option === card;
        option.classList.toggle('active', active);
        option.setAttribute('aria-checked', active);
        option.querySelector('i').className = `ph${active ? '-fill ph-check-circle' : ' ph-circle'}`;
    });
    updatePurchasePanel();
}));

$('[data-quantity-minus]')?.addEventListener('click', () => { quantity = Math.max(1, quantity - 1); updatePurchasePanel(); });
$('[data-quantity-plus]')?.addEventListener('click', () => { quantity += 1; updatePurchasePanel(); });
// Text review carousel controls
const reviewCarousel = $('[data-reviews-carousel]');
const moveReviews = direction => {
    if (!reviewCarousel) return;
    const card = $('.review-card', reviewCarousel);
    const gap = Number.parseFloat(getComputedStyle(reviewCarousel).gap) || 0;
    reviewCarousel.scrollBy({ left: direction * ((card?.getBoundingClientRect().width || 0) + gap), behavior: 'smooth' });
};
$('[data-review-prev]')?.addEventListener('click', () => moveReviews(-1));
$('[data-review-next]')?.addEventListener('click', () => moveReviews(1));
$('[data-sticky-quantity-minus]')?.addEventListener('click', () => { quantity = Math.max(1, quantity - 1); updatePurchasePanel(); });
$('[data-sticky-quantity-plus]')?.addEventListener('click', () => { quantity += 1; updatePurchasePanel(); });