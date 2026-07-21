import unittest
from unittest.mock import MagicMock, patch

from services.guide_service import create_guide_booking


class GuideServiceTests(unittest.TestCase):
    @patch("services.guide_service.get_db_connection")
    def test_create_guide_booking_skips_duplicate_active_booking(self, mock_get_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_db_connection.return_value = mock_conn

        mock_cursor.fetchone.side_effect = [
            {"status": "Available"},
            {"id": 99},
        ]

        create_guide_booking({"username": "alice", "guide_id": 1})

        insert_calls = [
            args
            for args in mock_cursor.execute.call_args_list
            if args.args and "INSERT INTO guide_bookings" in args.args[0]
        ]

        self.assertEqual(insert_calls, [])


if __name__ == "__main__":
    unittest.main()
