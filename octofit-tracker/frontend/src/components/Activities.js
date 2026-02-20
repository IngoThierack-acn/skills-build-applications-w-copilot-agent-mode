import React, { useEffect, useState } from 'react';

const Activities = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const endpoint = 'activities';
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  const base = codespace ? `https://${codespace}-8000.app.github.dev` : 'http://localhost:8000';
  const url = `${base}/api/${endpoint}/`;

  console.log('Activities endpoint:', url);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      const json = await res.json();
      console.log('Fetched data (activities):', json);
      const data = Array.isArray(json) ? json : (json.results || json);
      setItems(data || []);
    } catch (e) {
      console.error('Fetch error (activities):', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headers = items.length ? Object.keys(items[0]) : [];
  const filtered = items.filter(it => JSON.stringify(it).toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <h3 className="mb-3">Activities</h3>

      <div className="d-flex mb-3">
        <div className="me-auto">
          <button className="btn btn-primary me-2" onClick={fetchData}>Refresh</button>
          <button className="btn btn-secondary" onClick={() => { setModalData(items); setShowModal(true); }}>View JSON</button>
        </div>
        <div>
          <input className="form-control" placeholder="Filter..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>

      {loading && <div>Loading activities...</div>}
      {error && <div className="alert alert-danger">Error loading activities: {String(error)}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                {headers.map(h => <th key={h}>{h}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it, idx) => (
                <tr key={it.id || idx}>
                  {headers.map(h => (
                    <td key={h}>{typeof it[h] === 'object' ? JSON.stringify(it[h]) : String(it[h])}</td>
                  ))}
                  <td>
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => { setModalData(it); setShowModal(true); }}>View</button>
                    <a className="btn btn-sm btn-link" href="#">Details</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Activity JSON</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(modalData, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
