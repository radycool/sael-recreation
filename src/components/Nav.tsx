const BRAND_NAME = 'TERRA' // <-- swap this one constant to rename everywhere

export default function Nav() {
  return (
    <>
      <header className="site-nav">
        <div className="site-nav__logo">{BRAND_NAME}</div>
        <nav className="site-nav__links">
          <a href="#" className="is-active">INTRO</a>
          <a href="#">IMPACT</a>
          <a href="#">PRODUCT</a>
          <a href="#">CONTACT</a>
        </nav>
      </header>

      <div className="side-label">{BRAND_NAME}-1 MODEL</div>
    </>
  )
}

export { BRAND_NAME }
