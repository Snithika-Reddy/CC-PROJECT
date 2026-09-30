/**
 * Client-Side Router for Multi-Page Research Benchmarking Platform.
 * Supports hash-based navigation (#overview, #performance, #data, #methodology, #reproduction)
 * with full browser history support.
 */

export class Router {
  constructor(routes, defaultRoute = 'overview') {
    this.routes = routes;
    this.defaultRoute = defaultRoute;
    this.currentRoute = this.getInitialRoute();
    this.listeners = new Set();

    // Listen to hash changes (back/forward navigation)
    window.addEventListener('hashchange', () => {
      const newRoute = this.parseHash();
      this.setRoute(newRoute, false);
    });
  }

  parseHash() {
    const hash = window.location.hash.replace('#', '').trim().toLowerCase();
    if (this.routes.includes(hash)) {
      return hash;
    }
    return this.defaultRoute;
  }

  getInitialRoute() {
    return this.parseHash();
  }

  setRoute(route, updateHash = true) {
    const target = this.routes.includes(route) ? route : this.defaultRoute;
    if (this.currentRoute !== target || updateHash) {
      this.currentRoute = target;
      if (updateHash) {
        window.location.hash = target;
      }
      this.notify();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.currentRoute));
  }
}
