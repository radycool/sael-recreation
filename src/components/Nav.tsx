const BRAND_NAME = 'SAEL' // <-- swap this one constant to rename everywhere

export default function Nav() {
  return (
    <>
      <header className="site-nav">
        <nav className="site-nav__links">
          <a href="#" className="is-active">Company</a>
          <a href="#">Businesses</a>
          <a href="#">Sustainability</a>
          <a href="#">Investors</a>
          <a href="#">Newsroom</a>
          <a href="#">Career</a>
          <a href="#">Contact Us</a>
        </nav>
      </header>

      <div className="side-label">{BRAND_NAME}-1 MODEL</div>
    </>
  )
}

export { BRAND_NAME }
