package com.sptc.pis.jwt;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sptc.pis.jwt.models.ERole;
import com.sptc.pis.jwt.models.Role;
import com.sptc.pis.jwt.models.User;
import com.sptc.pis.jwt.repository.RoleRepository;
import com.sptc.pis.jwt.repository.UserRepository;
import com.sptc.pis.jwt.request.LoginRequest;
import com.sptc.pis.jwt.request.SignupRequest;
import com.sptc.pis.jwt.response.JwtResponse;
import com.sptc.pis.jwt.response.MessageResponse;
import com.sptc.pis.jwt.security.JwtUtils;
import com.sptc.pis.jwt.services.UserDetailsImpl;


@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

    private Logger logger = LoggerFactory.getLogger(AuthController.class);

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser( @RequestBody LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();		
		List<String> roles = userDetails.getAuthorities().stream()
				.map(item -> item.getAuthority())
				.collect(Collectors.toList());

		return ResponseEntity.ok(new JwtResponse(jwt, 
												 userDetails.getId(), 
												 userDetails.getUsername(), 
												 userDetails.getEmail(), 
												 roles));
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping("/signup")
	public ResponseEntity<?> registerUser( @RequestBody SignupRequest signUpRequest) {
	if (userRepository.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Username is already taken!"));
		}

		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Email is already in use!"));
		}

		// Create new user's account
		User user = new User(signUpRequest.getUsername(), 
							 signUpRequest.getEmail(),
							 encoder.encode(signUpRequest.getPassword()));
		logger.info("signupreq" + signUpRequest);
		Set<String> strRoles = signUpRequest.getRole();
		Set<Role> roles = new HashSet<>();
		logger.info("strRoles " + strRoles);
		if (strRoles == null) {
			Role userRole = roleRepository.findByName(ERole.ROLE_HOSPITAL_USER)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
			roles.add(userRole);
		} else {
			strRoles.forEach(role -> {
				switch (role) {
				case "admin":
					Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(adminRole);

					break;
				case "hospital_user":
					Role modRole = roleRepository.findByName(ERole.ROLE_HOSPITAL_USER)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(modRole);
					break;
				}
			});
		}

		user.setRoles(roles);
		userRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}
	
	
	
	public ResponseEntity<?> InitialregisterUser( SignupRequest signUpRequest) {
		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
				return ResponseEntity
						.badRequest()
						.body(new MessageResponse("Error: Username is already taken!"));
			}

			if (userRepository.existsByEmail(signUpRequest.getEmail())) {
				return ResponseEntity
						.badRequest()
						.body(new MessageResponse("Error: Email is already in use!"));
			}

			// Create new user's account
			User user = new User(signUpRequest.getUsername(), 
								 signUpRequest.getEmail(),
								 encoder.encode(signUpRequest.getPassword()));
			logger.info("signupreq" + signUpRequest);
			Set<String> strRoles = signUpRequest.getRole();
			Set<Role> roles = new HashSet<>();
			logger.info("strRoles " + strRoles);
			if (strRoles == null) {
				Role userRole = roleRepository.findByName(ERole.ROLE_HOSPITAL_USER)
						.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
				roles.add(userRole);
			} else {
				strRoles.forEach(role -> {
					switch (role) {
					case "admin":
						Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						roles.add(adminRole);

						break;
					case "hospital_user":
						Role modRole = roleRepository.findByName(ERole.ROLE_HOSPITAL_USER)
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						roles.add(modRole);
						break;
					}
				});
			}

			user.setRoles(roles);
			userRepository.save(user);

			return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
		}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/getUsers")
	public List<User> getUsers(){
		
		return userRepository.findAll();
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/deleteUser/{userId}")
	public Boolean deleteUser(@PathVariable Long userId) {
		try {
		userRepository.deleteById(userId);
		return true;
		}catch(Exception e){
			logger.info("Error while deleting the user", e.getMessage());
			return false;
		}
	}
	
	@PostMapping("/change-pwd")
	public ResponseEntity<String> changePassword(@RequestBody LoginRequest loginRequest) {
	try {
		if(loginRequest.getUsername().equalsIgnoreCase("admin")){
			return new ResponseEntity<String>("Not Allowed",HttpStatus.FORBIDDEN);
		}
		User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new UsernameNotFoundException(loginRequest.getUsername()));
		if(user.getRoles().contains(roleRepository.findByName(ERole.ROLE_ADMIN).get())) {
			return new ResponseEntity<String>("Not Allowed",HttpStatus.FORBIDDEN);
		}else {
			user.setPassword(encoder.encode(loginRequest.getPassword()));
			userRepository.save(user);
			return new ResponseEntity<String>("Password Changed Successfully",HttpStatus.OK);	
		}
	}catch(UsernameNotFoundException e) {
		return new ResponseEntity<String>("Bad credentials",HttpStatus.BAD_REQUEST);
	}catch(Exception e) {
		return new ResponseEntity<String>("Failed to change password",HttpStatus.METHOD_FAILURE);
	}
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping("/edit-user/{id}")
	public ResponseEntity<?> editUser( @RequestBody SignupRequest signUpRequest, @PathVariable Long id) {
		
		User user =  userRepository.findById(id).get();
		
		user.setUsername(signUpRequest.getUsername());
		user.setEmail(signUpRequest.getEmail());
//		user.setPassword(encoder.encode(signUpRequest.getPassword()));
		user.setRoles(null);
		
		Set<String> strRoles = signUpRequest.getRole();
		Set<Role> roles = new HashSet<>();
		logger.info("strRoles " + strRoles);
		if (strRoles == null) {
			Role userRole = roleRepository.findByName(ERole.ROLE_HOSPITAL_USER)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
			roles.add(userRole);
		} else {
			strRoles.forEach(role -> {
				switch (role) {
				case "admin":
					Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(adminRole);

					break;
				case "hosptial_user":
					Role modRole = roleRepository.findByName(ERole.ROLE_HOSPITAL_USER)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(modRole);
					break;
				
				}
			});
		}

		user.setRoles(roles);
		userRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}
	
	
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/check-username-available/{username}")
	public ResponseEntity<Boolean> checkUsername(@PathVariable String username) {
		try {
			Optional<User> user = userRepository.findByUsername(username);
			if (!user.isPresent()) {
				logger.info("Username is available");
				return new ResponseEntity<Boolean>(true, HttpStatus.OK);
			} else {
				logger.info("Username already exists : {}", user.get().getUsername());
				return new ResponseEntity<Boolean>(false, HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.info(e.getMessage());
			return new ResponseEntity<Boolean>(false, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}



}
