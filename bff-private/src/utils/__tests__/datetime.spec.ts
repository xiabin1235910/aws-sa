import { dateFromNow } from '../datetime';

it('renders correctly', () => {
    const result = dateFromNow(new Date().getTime(), 'en_US');
    expect(result).toBe('a few seconds ago')
});