import Link from "next/link"; 

export const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>On To Work</div>
      <nav style={styles.nav}>
        <Link href="/jobs" style={styles.link}>Jobs</Link>
      </nav>
      <nav style={styles.nav}>
        <Link href="/dashboard" style={styles.link}>Dashboard</Link>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #ddd',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    gap: '15px',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '16px',
    fontWeight: '500',
  }
};
