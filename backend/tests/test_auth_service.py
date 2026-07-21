import unittest
from unittest.mock import MagicMock, patch

from services.auth_service import login_user


class AuthServiceTests(unittest.TestCase):
    @patch("services.auth_service.get_db_connection")
    def test_login_user_accepts_legacy_plaintext_passwords(self, mock_get_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_db_connection.return_value = mock_conn

        mock_cursor.fetchone.return_value = {
            "user_id": 7,
            "username": "tourist1",
            "password": "1234",
        }

        user = login_user({"username": "tourist1", "password": "1234"})

        self.assertEqual(user["username"], "tourist1")
        self.assertEqual(user["user_id"], 7)


if __name__ == "__main__":
    unittest.main()
