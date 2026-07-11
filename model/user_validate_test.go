package model

import (
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func insertUserForValidateAndFillTest(t *testing.T, username, email, plainPassword string, status int) *User {
	t.Helper()

	hashedPassword, err := common.Password2Hash(plainPassword)
	require.NoError(t, err)

	user := &User{
		Username:    username,
		Email:       email,
		Password:    hashedPassword,
		DisplayName: "Display " + username,
		Status:      status,
		Quota:       42,
	}
	require.NoError(t, DB.Create(user).Error)
	return user
}

func TestUser_ValidateAndFill(t *testing.T) {
	t.Run("success by username trims whitespace", func(t *testing.T) {
		truncateTables(t)

		stored := insertUserForValidateAndFillTest(t, "alice", "alice@example.com", "secret123", common.UserStatusEnabled)

		input := &User{
			Username: "  alice  ",
			Password: "secret123",
		}

		err := input.ValidateAndFill()
		require.NoError(t, err)
		assert.Equal(t, stored.Id, input.Id)
		assert.Equal(t, stored.Username, input.Username)
		assert.Equal(t, stored.Email, input.Email)
		assert.Equal(t, stored.DisplayName, input.DisplayName)
		assert.Equal(t, stored.Status, input.Status)
		assert.Equal(t, stored.Quota, input.Quota)
	})

	t.Run("success by email", func(t *testing.T) {
		truncateTables(t)

		stored := insertUserForValidateAndFillTest(t, "bob", "bob@example.com", "secret123", common.UserStatusEnabled)

		input := &User{
			Username: "bob@example.com",
			Password: "secret123",
		}

		err := input.ValidateAndFill()
		require.NoError(t, err)
		assert.Equal(t, stored.Id, input.Id)
		assert.Equal(t, stored.Username, input.Username)
		assert.Equal(t, stored.Email, input.Email)
		assert.Equal(t, stored.DisplayName, input.DisplayName)
	})

	t.Run("rejects empty credentials", func(t *testing.T) {
		truncateTables(t)

		input := &User{}

		err := input.ValidateAndFill()
		require.ErrorIs(t, err, ErrUserEmptyCredentials)
	})

	t.Run("rejects invalid password", func(t *testing.T) {
		truncateTables(t)

		insertUserForValidateAndFillTest(t, "carol", "carol@example.com", "secret123", common.UserStatusEnabled)

		input := &User{
			Username: "carol",
			Password: "wrong-password",
		}

		err := input.ValidateAndFill()
		require.ErrorIs(t, err, ErrInvalidCredentials)
	})

	t.Run("rejects disabled user", func(t *testing.T) {
		truncateTables(t)

		insertUserForValidateAndFillTest(t, "dave", "dave@example.com", "secret123", common.UserStatusDisabled)

		input := &User{
			Username: "dave",
			Password: "secret123",
		}

		err := input.ValidateAndFill()
		require.ErrorIs(t, err, ErrInvalidCredentials)
	})
}
